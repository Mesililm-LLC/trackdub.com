import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Turnstile widget sitekey (public). Set VITE_TURNSTILE_SITE_KEY at build
// time to the real Turnstile site from the Cloudflare dashboard — the
// fallback below is only a placeholder for local dev/preview builds that
// never set it.
const TURNSTILE_SITE_KEY: string =
  import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "0x4AAAAAAD9pNIBkKRhSY098";

const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3, "Enter your email")
    .max(320, "Email is too long")
    .email("That doesn't look like an email"),
});

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
    };
    __onTurnstileLoad__?: () => void;
  }
}

const WAITLIST_INTERESTS = new Set(["personal", "pro", "studio"]);

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [verificationState, setVerificationState] = useState<"required" | "ready" | "error">(
    "required",
  );
  // The interest tag is read once from the URL (?interest=...) and only used
  // in the signup POST body — it never affects rendered markup, so a lazy
  // initializer is hydration-safe and avoids a state write inside an effect.
  const [interest] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const fromUrl = new URLSearchParams(window.location.search).get("interest");
    return fromUrl && WAITLIST_INTERESTS.has(fromUrl) ? fromUrl : null;
  });
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Render the widget explicitly instead of Turnstile's implicit
  // `.cf-turnstile` auto-scan: on an SSR'd page the auto-scan can run before
  // (or race) the container landing in the DOM and silently no-op, leaving
  // the widget permanently blank with no console error. Rendering once both
  // the container ref and the turnstile API are confirmed ready removes
  // that race entirely.
  useEffect(() => {
    let cancelled = false;
    const tryRender = () => {
      if (cancelled || !widgetContainerRef.current || widgetIdRef.current || !window.turnstile) {
        return;
      }
      widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        action: "waitlist_signup",
        callback: (token: string) => {
          setTurnstileToken(token);
          setVerificationState("ready");
        },
        "error-callback": (errorCode: string) => {
          console.warn("[waitlist] Turnstile error", errorCode);
          setTurnstileToken(null);
          setVerificationState("error");
          return true;
        },
        "expired-callback": () => {
          setTurnstileToken(null);
          setVerificationState("required");
          window.turnstile?.reset(widgetIdRef.current ?? undefined);
        },
      });
    };
    if (window.turnstile) {
      tryRender();
    } else {
      window.__onTurnstileLoad__ = tryRender;
    }
    return () => {
      cancelled = true;
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current);
      delete window.__onTurnstileLoad__;
    };
  }, []);

  function resetVerification() {
    setTurnstileToken(null);
    setVerificationState("required");
    window.turnstile?.reset(widgetIdRef.current ?? undefined);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    const parsed = waitlistSchema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    if (!turnstileToken) {
      widgetContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error("Complete the security check below to join the launch list.");
      return;
    }
    setStatus("loading");
    const normalized = parsed.data.email.toLowerCase();
    // trackdub.dev (ChatGPT Sites) has no D1/Turnstile bindings of its own,
    // so it posts cross-origin to the canonical API on trackdub.com instead
    // of relying on its own (nonexistent) server env. Every other host
    // (localhost, Workers preview URLs, QA) keeps the relative endpoint —
    // the production preflight only allow-lists trackdub.dev origins, so
    // routing them to the absolute URL would just fail CORS.
    const apiBase =
      typeof window !== "undefined" &&
      (window.location.hostname === "trackdub.dev" ||
        window.location.hostname === "www.trackdub.dev")
        ? "https://trackdub.com"
        : "";
    try {
      const res = await fetch(`${apiBase}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalized,
          turnstileToken,
          interest: interest ?? undefined,
        }),
      });
      const data: { ok: boolean; error?: string } | null = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setStatus("idle");
        if (res.status === 403) {
          resetVerification();
          toast.error("Verification expired. Please complete it again.");
          return;
        }
        toast.error(data?.error || "Could not join the list. Try again in a moment.");
        return;
      }
    } catch {
      setStatus("idle");
      toast.error("Could not reach the server. Try again in a moment.");
      return;
    }
    setStatus("done");
    toast.success("You're on the list.");
  }

  if (status === "done") {
    return (
      <p className="mx-auto mt-12 max-w-md font-mono text-[13px] uppercase tracking-[0.14em] text-accent">
        You're on the list. We'll email you when Trackdub ships.
      </p>
    );
  }

  return (
    <>
      <script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__onTurnstileLoad__&render=explicit"
        async
        defer
      />
      <form
        onSubmit={onSubmit}
        className="mx-auto mt-12 flex w-full max-w-md flex-col items-center gap-3"
        noValidate
      >
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <input
            id="waitlist-email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={320}
            placeholder="you@studio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="flex-1 rounded-sm border border-border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading" || !turnstileToken}
            aria-describedby="waitlist-verification-status"
            className="inline-flex items-center justify-center rounded-sm bg-foreground px-6 py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-background outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
          >
            {status === "loading"
              ? "Adding…"
              : turnstileToken
                ? "Join launch list"
                : "Verify below"}
          </button>
        </div>
        <div ref={widgetContainerRef} />
        <p
          id="waitlist-verification-status"
          className="text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
          aria-live="polite"
        >
          {verificationState === "ready"
            ? "Security check complete. You can join the list."
            : verificationState === "error"
              ? "Security check needs attention. Retry below."
              : "Complete the security check to enable the join button."}
        </p>
        {verificationState === "error" && (
          <button
            type="button"
            onClick={resetVerification}
            className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent underline underline-offset-4"
          >
            Retry security check
          </button>
        )}
      </form>
    </>
  );
}

/* ---------------- colophon ---------------- */
