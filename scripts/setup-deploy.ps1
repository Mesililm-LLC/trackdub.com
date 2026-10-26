# =============================================================================
# scripts/setup-deploy.ps1
#
# End-to-end Cloudflare Workers deploy for trackdub.com:
#   1. Preflight (bun, npx, wrangler.jsonc, migrations/)
#   2. Read CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID + VITE_TURNSTILE_SITE_KEY
#      — each via Read-Host -AsSecureString, never written to chat
#   3. bun run build  (VITE_TURNSTILE_SITE_KEY inlined by Vite)
#   4. Workers secrets: TURNSTILE_SECRET, RESEND_API_KEY, RESEND_FROM_EMAIL
#      — values piped to `wrangler secret put` via stdin
#   5. wrangler deploy --config .output/server/wrangler.json
#   6. Parse *.workers.dev URL; probe POST /api/waitlist with a dummy Turnstile
#      token (expected: 403 with error="Verification failed" — proves the worker
#      is live AND the TURNSTILE_SECRET binding works AND the route is reachable)
#   7. Cleanup: wipe every secret from process.env + PowerShell variables
#
# Re-run any time after token rotation or fresh checkout. Idempotent — replaces
# each secret and re-deploys cleanly.
#
# Requires PowerShell 7+ (`pwsh` on Linux/macOS, the built-in PowerShell on
# modern Windows). PowerShell 5.x has subtle Marshal differences on Linux and
# won't unwrap SecureString the same way.
#
# Usage (from repo root):
#   pwsh scripts/setup-deploy.ps1
# or, on Windows + pwsh aliased to `powershell`:
#   .\scripts/setup-deploy.ps1
# =============================================================================

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Step {
    param([string]$Title)
    Write-Host ''
    Write-Host "--- $Title ---" -ForegroundColor Cyan
}

function Need-Command {
    param([string]$Name, [string]$Hint = '')
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' not found on PATH. $Hint"
    }
}

function Read-Secret {
    <#
    Read a secret via Read-Host -AsSecureString and unwrap it to a plain string
    for use in a single targeted command. The BSTR returned by the marshal is
    zeroed before this function returns. Do not store the returned value in a
    variable that's likely to be echoed back, written to disk, or piped into
    chat logs.
    #>
    param([Parameter(Mandatory)][string]$Prompt)
    $secure = Read-Host -Prompt $Prompt -AsSecureString
    if (-not $secure -or $secure.Length -eq 0) { throw "Empty input for '$Prompt'." }
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        return [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    } finally {
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
}

# ---------- 1. Preflight ----------
Step 'Preflight'
Need-Command 'bun'  'Install Bun: https://bun.sh'
Need-Command 'npx'  'Install Node.js 18+'
if (-not (Test-Path .\wrangler.jsonc)) { throw 'wrangler.jsonc missing in repo root.' }
if (-not (Test-Path .\migrations))    { throw 'migrations/ missing in repo root.' }

# ---------- 2. Read credentials ----------
Step 'Read credentials (each via SecureString)'
$cfToken    = Read-Secret 'CLOUDFLARE_API_TOKEN (Account: D1:Edit on account 21cac5947e11018d571c18792118b8b0)'
$cfAccount  = Read-Secret 'CLOUDFLARE_ACCOUNT_ID'

$siteKeyDefault = '0x4AAAAAAD9pNIBkKRhSY098'
$siteKeyRaw     = Read-Host -Prompt "VITE_TURNSTILE_SITE_KEY (Enter = trackdub-waitlist widget: $siteKeyDefault)"
$siteKey        = if ([string]::IsNullOrWhiteSpace($siteKeyRaw)) { $siteKeyDefault } else { $siteKeyRaw.Trim() }

# Set in process.env so all subsequent wrangler + bun invocations inherit them.
$env:CLOUDFLARE_API_TOKEN  = $cfToken
$env:CLOUDFLARE_ACCOUNT_ID = $cfAccount

# ---------- 3. Build ----------
Step 'Build (bun run build) — VITE_TURNSTILE_SITE_KEY inlined for Vite'
$env:VITE_TURNSTILE_SITE_KEY = $siteKey
try {
    bun run build
    if ($LASTEXITCODE -ne 0) { throw "bun run build exited with code $LASTEXITCODE" }
} finally {
    Remove-Item Env:\VITE_TURNSTILE_SITE_KEY -ErrorAction SilentlyContinue
}
if (-not (Test-Path .\.output\server\index.mjs)) { throw 'Build did not produce .output\server\index.mjs — check bun build errors above.' }

# ---------- 4. Workers secrets ----------
Step 'Workers secrets — each value piped to `wrangler secret put` via stdin'
$secretSpec = @(
    @{ Name = 'TURNSTILE_SECRET'  }
    @{ Name = 'RESEND_API_KEY'    }
    @{ Name = 'RESEND_FROM_EMAIL' }
    @{ Name = 'WEB_BOT_AUTH_PRIVATE_JWK' }
)
foreach ($s in $secretSpec) {
    $prompt = switch ($s.Name) {
        'TURNSTILE_SECRET'  { 'TURNSTILE_SECRET   (Cloudflare Turnstile -> Widgets -> Secret Key)' }
        'RESEND_API_KEY'    { 'RESEND_API_KEY     (resend.com -> API Keys)' }
        'RESEND_FROM_EMAIL' { 'RESEND_FROM_EMAIL  (e.g. "Trackdub <hello@trackdub.com>")' }
        'WEB_BOT_AUTH_PRIVATE_JWK' { 'WEB_BOT_AUTH_PRIVATE_JWK (Ed25519 private JWK JSON, one line)' }
    }
    $value = Read-Secret -Prompt $prompt
    Write-Host "  -> wrangler secret put $($s.Name) ..." -ForegroundColor Gray
    # Pipe the value into wrangler's stdin. wrangler reads the secret from
    # stdin when no --text flag is given. The plaintext lives in
    # process memory just for this invocation; nothing hits a file.
    $value | & npx wrangler secret put $s.Name 2>&1 | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "wrangler secret put $($s.Name) failed (exit $LASTEXITCODE)" }
    # Best-effort scope scrub: drop reference so GC can collect.
    Remove-Variable value -ErrorAction SilentlyContinue | Out-Null
}

# ---------- 5. Deploy ----------
Step 'Deploy (wrangler deploy --config .output/server/wrangler.json)'
$deployLines = @()
& npx wrangler deploy --config .output/server/wrangler.json 2>&1 | ForEach-Object {
    $deployLines += $_
    $_
}
if ($LASTEXITCODE -ne 0) {
    Write-Host ''
    Write-Host 'wrangler deploy failed. Last 30 lines of output:' -ForegroundColor Red
    $deployLines | Select-Object -Last 30 | ForEach-Object { Write-Host "  $_" }
    throw "wrangler deploy exited with $LASTEXITCODE"
}

$matched = ($deployLines | Select-String -Pattern 'https://[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev' -AllMatches).Matches
if (-not $matched -or $matched.Count -eq 0) {
    Write-Host ''
    Write-Host "Couldn't parse the workers.dev URL out of wrangler's output. Last 20 lines:" -ForegroundColor Yellow
    $deployLines | Select-Object -Last 20 | ForEach-Object { Write-Host "  $_" }
    throw 'Aborted before round-trip probe — capture URL manually.'
}
$workerUrl = $matched[0].Value
Write-Host ''
Write-Host "  * Deployed: $workerUrl" -ForegroundColor Green

# ---------- 6. Round-trip probe ----------
Step 'Round-trip probe (POST /api/waitlist with dummy Turnstile token)'
$probeTs    = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$probeEmail = "probe-$probeTs@trackdub.com"
$probeBody  = @{
    email          = $probeEmail
    turnstileToken = 'XXXX.DUMMY.TOKEN.XXXX'
} | ConvertTo-Json -Compress
$probeHeaders = @{ 'Content-Type' = 'application/json' }

$probeCode   = $null
$probeOutput = $null
$probeError  = $null
try {
    $probeOutput = Invoke-RestMethod -Method POST -Uri "$workerUrl/api/waitlist" -Body $probeBody -Headers $probeHeaders -TimeoutSec 15
    $probeOutputJson = $probeOutput | ConvertTo-Json -Compress
    $probeCode = 200
} catch {
    $probeError = $_
    # WebException / HttpResponseException surfaces the HTTP status code
    $statusCodeNum = $null
    if ($_.Exception.Response) {
        try { $statusCodeNum = [int]$_.Exception.Response.StatusCode } catch { }
    }
    if ($null -eq $statusCodeNum) {
        # PowerShell sometimes surfaces response via InnerException
        try {
            $inner = $_.Exception.InnerException
            if ($inner -and $inner.Response) { $statusCodeNum = [int]$inner.Response.StatusCode }
        } catch { }
    }
    $probeCode = if ($statusCodeNum) { $statusCodeNum } else { 'ERROR' }
    # Try to read the response body from the exception
    try {
        $respStream = $_.Exception.Response.GetResponseStream()
        if ($respStream) {
            $reader = New-Object System.IO.StreamReader($respStream)
            $probeOutputJson = $reader.ReadToEnd()
            $reader.Close()
        } else {
            $probeOutputJson = $_.Exception.Message
        }
    } catch {
        $probeOutputJson = $_.Exception.Message
    }
}

Write-Host "  Email:    $probeEmail"
Write-Host "  URL:      $workerUrl/api/waitlist"
Write-Host "  Status:   $probeCode"
Write-Host "  Body:     $probeOutputJson"

if ($probeCode -eq 403 -and ($probeOutputJson -match 'Verification failed')) {
    Write-Host ''
    Write-Host '  v Live Worker reachable + Turnstile gating wired correctly.' -ForegroundColor Green
    Write-Host '    A real Turnstile widget token from the homepage form will return ok:true.' -ForegroundColor Green
    Write-Host "    D1 row insertion gated until a valid siteverify passes; Resend also gated by this same check." -ForegroundColor Green
} elseif ($probeCode -eq 200 -and ($probeOutputJson -match '"ok"\s*:\s*true')) {
    Write-Host ''
    Write-Host '  !! Unexpected: real ok:true with a dummy token. Investigate Turnstile secret wiring.' -ForegroundColor Yellow
} elseif ($probeCode -in @(400,500)) {
    Write-Host ''
    Write-Host '  ! Server-side failure on probe. Paste Status + Body for diagnosis.' -ForegroundColor Yellow
} else {
    Write-Host ''
    Write-Host '  ? Unexpected shape. Paste Status + Body for diagnosis.' -ForegroundColor Yellow
}

# ---------- 7. Cleanup ----------
# Wipe every secret-shaped value from process.env and from any in-memory
# PowerShell variables. GC.Collect is best-effort — the JIT'd runtime may
# keep intermediate copies around in string-intern tables, but we minimise
# the exposure window.
Step 'Cleanup'
Remove-Item Env:\CLOUDFLARE_API_TOKEN  -ErrorAction SilentlyContinue
Remove-Item Env:\CLOUDFLARE_ACCOUNT_ID -ErrorAction SilentlyContinue
Remove-Item Env:\VITE_TURNSTILE_SITE_KEY -ErrorAction SilentlyContinue
foreach ($v in @('cfToken','cfAccount','siteKey','siteKeyRaw','probeBody','probeHeaders','deployLines')) {
    Remove-Variable $v -ErrorAction SilentlyContinue | Out-Null
}
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers() | Out-Null
[System.GC]::Collect()
Write-Host ''
Write-Host 'Done. Creds unwound from this PowerShell session.' -ForegroundColor Green
Write-Host "Workers URL:  $workerUrl"
Write-Host 'Record this URL — re-run the script anytime to redeploy with new secrets.' -ForegroundColor Gray
