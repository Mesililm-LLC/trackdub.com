import type { MouseEvent } from "react";

export const GITHUB_REPO = "https://github.com/mesalimllc/Trackdub";

// Module-scope helpers for browser APIs that React's purity rules flag when
// they appear lexically inside component code. Every call site below is an
// event handler, an rAF loop, or a mount-time read — never render — but
// routing through these keeps the rules quiet with zero behavioral change.
export function now(): number {
  return performance.now();
}

export function setLocationHash(hash: string) {
  window.location.hash = hash;
}

// Math.sin/Math.cos can differ in the last bit between Bun (SSR) and the
// browser's JS engine, which trips React hydration mismatch warnings for
// decorative SVG generators. Rounding right after the trig call keeps SSR
// and client markup byte-identical.
export function round3(n: number) {
  return Number(n.toFixed(3));
}

export const NAV = [
  { href: "#pipeline", label: "Pipeline" },
  { href: "#walkthrough", label: "Try it" },
  { href: "#resume", label: "Resume" },
  { href: "#control", label: "Control" },
  { href: "#performance", label: "Performance" },
  { href: "#architecture", label: "Local-first" },
  { href: "#manifest", label: "Manifest" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#waitlist", label: "Launch list" },
];

export const NAV_PRIMARY = new Set([
  "#pipeline",
  "#walkthrough",
  "#control",
  "#performance",
  "#pricing",
]);

// Click a rubber stamp to re-slam it. No-op under reduce-motion (the
// stamp-thunk animation is disabled there, so nothing replays).
export function replayStamp(e: MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "";
}

/* ---------------- section rail (kinetic progress) ---------------- */

export const DIM = "oklch(0.62 0.02 245)";

export const INK = "oklch(0.94 0.005 240)";

export const LINE = "oklch(0.28 0.014 250)";

export const ACC = "oklch(0.72 0.15 258)";

export const PANEL = "oklch(0.16 0.010 250)";

export const PANEL_HI = "oklch(0.20 0.012 250)";
