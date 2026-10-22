# ChatGPT Sites plan for Trackdub

**Goal:** Publish a version of the Trackdub marketing site via OpenAI ChatGPT
Sites, built from the site's _actual_ copy, served on a custom domain we
control.

**Why this replaces the proxy (sites-proxy/):** ChatGPT Sites is a generative
builder — it assembles a site from your prompt/content and hosts it on
OpenAI's runtime (`*.openai.chatgpt.site` or your own domain via DNS). It
never fetches an external origin, so a reverse proxy like `trackdub.dev`
has no consumer in the product. The supported route is: give ChatGPT the
content, then point DNS at OpenAI. This document is that route.

---

## 0. Prerequisites & eligibility

- ChatGPT Sites is in public beta for **Plus, Pro, and Business/workspace**
  accounts. **Not available on Free/Go**, and **not in the EEA, Switzerland,
  or the UK at launch**.
- **Custom domains are not available in Enterprise workspaces** at launch.
  Confirm we're on a Plus/Pro/Business account before starting.
- We own `trackdub.com` (Cloudflare zone — confirmed by
  `scripts/apply-agent-dns.mjs` using `ZONE_NAME = "trackdub.com"`), so DNS
  changes are under our control.

### Domain decision

Recommend a **subdomain of the real domain** so ChatGPT can build content
that references the canonical site without DNS friction:

- **Recommended:** `sites.trackdub.com` (or `ai.trackdub.com`) — clearly a
  companion surface, keeps the apex for the real product.
- Alternative: the default `*.openai.chatgpt.site` URL (no DNS needed) if we
  want zero setup — but then we can't brand it.

---

## 1. Content package (paste into ChatGPT with @Sites)

Everything below is extracted verbatim from the current codebase
(`src/routes/*.tsx`, `src/lib/pricing.ts`) so the generated site reflects
the real product.

### Brand & voice

- **Product:** Trackdub — a desktop workstation for translating, voicing,
  and mixing video.
- **Tagline:** "Dub videos into other languages without giving up control."
- **Positioning:** Local-first. Every stage of the pipeline is inspectable,
  editable, and rerunnable, from the transcript to the final mix. Media
  never leaves the machine unless the user says so.
- **Contact:** `hello@trackdub.com` · press `press@trackdub.com`
- **Repo:** github.com/mesalimllc (public)

### Trust strip

Local by default · Deterministic runs · Cross-platform · Open manifest ·
No account required · Per-line regen · Resumable jobs · CPU fallback, always
· Your disk, your files

### The 6-stage pipeline (use these verbatim)

1. **Ingest** — Probe media. Detect scenes, silence, and speech.
2. **Transcribe** — Time-accurate source transcript with speaker turns.
3. **Translate** — Human-editable target script, tied to timecode.
4. **Diarize** — Assign speakers. Attach a voice reference to each one.
5. **Voice** — Zero-shot TTS. Regenerate any single line.
6. **Mix** — Align, duck under music, mux the final file.

### Pricing (single source of truth: `src/lib/pricing.ts`)

| Plan         | Price          | Notes                                     | Features                                                                                                       |
| ------------ | -------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Personal** | Free           | Commercial use allowed                    | Full desktop app, every stage · all languages + bundled models · CLI included · watermarked exports, 5-min max |
| **Pro**      | $149           | One-time purchase · 2 machine activations | Everything in Personal · no watermark, no duration limit · commercial license · lifetime v1.x updates          |
| **Studio**   | In development | Post-launch, not sold yet                 | Batch + multi-GPU · 4K export pipeline · commercial redistribution rights                                      |

Pricing page headline: **"One-time purchase. No subscription, ever."**
Copy: "Trackdub is priced like software you own, not software you rent."

### FAQ (from the homepage)

1. **Does my video get uploaded anywhere?** — No. Runs the whole pipeline
   on your machine by default. Cloud endpoints are opt-in per project/stage.
2. **What happens to my data if I uninstall?** — Projects/media/output live
   in folders you chose; app data (`%LOCALAPPDATA%\Trackdub`) can be removed
   during uninstall.
3. **Can I use it commercially?** — Yes, every tier. Free has a watermark +
   5-min cap; Pro removes both. Bundled models are commercial-safe by manifest.
4. **How is voice cloning handled?** — One short, reviewable reference clip
   per speaker; one voice per person, references stay on disk.
5. **What if ASR gets a word wrong?** — Fix it in the transcript; only the
   affected line invalidates and queues for regen.
6. **Do I need a GPU?** — No. CPU is the portable baseline; TensorRT, CUDA,
   DirectML, CoreML, MIGraphX, OpenVINO, QNN available per stage with
   automatic fallback.
7. **Can I automate it?** — Yes. CLI ships in every tier; scriptable for
   batch localization, CI, or an on-prem REST worker via the SDK.
8. **Can it run offline?** — Yes, once selected models are downloaded.
9. **Can I choose the accelerator?** — Automatic mode per stage, or an
   execution policy that prefers/excludes providers.

### Status messaging

Trackdub is **pre-launch** — the site runs a **waitlist** ("Join launch
list", "Be first to know when downloads, release notes, and preview
invitations are ready"). The ChatGPT Sites version should **not** claim the
app is available. Primary CTA = the launch list (link back to
`trackdub.com/#waitlist`).

---

## 2. Master prompt (copy-paste)

```text
@Sites Build a marketing site for Trackdub, a local-first desktop
workstation for dubbing video into other languages. Use ONLY the content
below — do not invent features, prices, or availability claims.

BRAND: Trackdub. Tagline: "Dub videos into other languages without giving
up control." Positioning: local-first; every pipeline stage is inspectable,
editable, and rerunnable; media never leaves the machine unless the user
says so.

STRUCTURE:
1. Hero — tagline + short positioning paragraph + primary CTA "Join launch
   list" (link to https://trackdub.com/#waitlist) and secondary CTA
   "Explore the workflow".
2. Pipeline — the 6 stages (Ingest, Transcribe, Translate, Diarize, Voice,
   Mix) with the one-line descriptions provided.
3. Trust strip — the 9 items (Local by default, Deterministic runs,
   Cross-platform, Open manifest, No account required, Per-line regen,
   Resumable jobs, CPU fallback always, Your disk, your files).
4. Pricing — three plans: Personal Free (watermarked, 5-min max),
   Pro $149 one-time (no watermark/cap, lifetime v1.x updates, featured),
   Studio "In development / not sold yet". Headline: "One-time purchase.
   No subscription, ever."
5. FAQ — the 9 questions and answers provided.
6. Footer — hello@trackdub.com, press@trackdub.com, GitHub link,
   "Trackdub is pre-launch — join the launch list."

DESIGN: elegant editorial style; serif display headings; monospace
uppercase labels; a single accent color; numbered section markers (00, 01,
02…); generous whitespace; dark theme with a light option; reduced-motion
support. Keep it restrained and typographic — no gradients or clip-art.

CONTENT — verbatim, do not add or change claims:
[Paste the full content package from section 1.]
```

---

## 3. DNS setup for the custom domain

Per OpenAI's official flow (help.openai.com — "Creating and managing ChatGPT
Sites"):

1. **In ChatGPT Sites:** open the site → **More actions → Settings → Add
   domain**.
2. **Enter** `sites.trackdub.com` (or the chosen subdomain).
3. **Copy the DNS records Sites provides** — do not improvise: OpenAI
   generates the exact record set (typically a verification TXT plus the
   host record) per site. Add **exactly those records**.
4. **Add them in Cloudflare** for the `trackdub.com` zone:
   - Dashboard → `trackdub.com` → **DNS → Records → Add record**.
   - Enter the type/name/value exactly as shown by Sites.
   - **Proxying caveat:** for records that must resolve to OpenAI's
     infrastructure, keep the record **DNS only** (grey cloud) if Sites
     requires direct resolution — follow what the record needs to
     validate. Don't leave it proxied if validation fails.
5. **Wait a few minutes**, then **refresh the domain status** in Sites.
6. When status shows connected, the generated site is live at
   `https://sites.trackdub.com`.

> If the domain is already used by the real product (it is — trackdub.com),
> always use a **new subdomain**; never move the apex or an in-use host.

---

## 4. Pre-launch checklist

- [ ] Run the master prompt; review the generated preview carefully.
- [ ] **Accuracy:** no invented features, prices, or "available now" claims;
      Studio still marked "in development".
- [ ] **CTAs:** every primary CTA goes to `trackdub.com/#waitlist` (or the
      same waitlist), not a fake download.
- [ ] **Links:** contact emails, GitHub, changelog point to the real ones.
- [ ] **SEO:** decide whether the Sites copy should be `noindex` — if it
      duplicates canonical marketing content, keep it out of search to
      preserve trackdub.com as the authoritative page (Sites lets you
      control indexing; prefer noindex on a near-duplicate).
- [ ] **Sensitive data:** no internal data, keys, or unreleased numbers.
- [ ] **Access:** set sharing to _Anyone on the internet_ only if it's meant
      to be public; otherwise keep it workspace-limited.
- [ ] **Custom domain DNS:** records added at Cloudflare, status green in
      Sites.
- [ ] After publish: open the URL, verify HTTPS, navigation, and that the
      waitlist form/links work from the mirror.

---

## 5. Open questions before executing

1. **Account eligibility:** confirm the OpenAI account is Plus/Pro/Business
   and outside EEA/CH/UK (custom domains not available in Enterprise).
2. **Subdomain choice:** `sites.trackdub.com` vs. default
   `*.openai.chatgpt.site` (no DNS).
3. **indexing:** noindex the Sites copy, or allow it (content isn't
   byte-identical to trackdub.com, so duplicate-content risk is low).
4. **Purpose:** is this a demo/experiment (workspace-only sharing is fine)
   or a public companion page?
