import { useEffect, useSyncExternalStore } from "react";

type MotionMode = "full" | "reduced";

const MOTION_KEY = "trackdub:motion";

// The motion preference lives in localStorage and defaults to the OS
// prefers-reduced-motion setting when unset. It's modeled as an external
// store via useSyncExternalStore — not state set inside an effect — so the
// two toggle instances (desktop header + mobile menu) stay in sync and SSR
// hydration stays safe: the server snapshot renders the default, then the
// store corrects to the saved preference once mounted.
const motionSubscribers = new Set<() => void>();

// Set only when localStorage.setItem throws. Non-null means the last chosen
// mode could not be persisted; prefer it over a readable-but-stale getItem
// result so the toggle still updates when writes are blocked.
let motionMemory: MotionMode | null = null;

function motionSubscribe(onStoreChange: () => void) {
  motionSubscribers.add(onStoreChange);
  return () => {
    motionSubscribers.delete(onStoreChange);
  };
}

function motionNotify() {
  for (const cb of motionSubscribers) cb();
}

function getMotionSnapshot(): MotionMode {
  if (typeof window === "undefined") return "full";
  if (motionMemory) return motionMemory;
  try {
    const stored = localStorage.getItem(MOTION_KEY);
    if (stored === "full" || stored === "reduced") return stored;
  } catch {
    // Fall through to OS preference when storage is unreadable.
  }
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full";
}

function getMotionServerSnapshot(): MotionMode {
  return "full";
}

export function MotionToggle() {
  const mode = useSyncExternalStore(motionSubscribe, getMotionSnapshot, getMotionServerSnapshot);

  // Apply the preference to the document (an external system) — a DOM sync,
  // not a state write, so it stays legal in an effect.
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", mode === "reduced");
  }, [mode]);

  const next: MotionMode = mode === "reduced" ? "full" : "reduced";
  const label = mode === "reduced" ? "Motion: off" : "Motion: on";

  const setMode = (m: MotionMode) => {
    try {
      localStorage.setItem(MOTION_KEY, m);
      motionMemory = null;
    } catch {
      motionMemory = m;
    }
    motionNotify();
  };

  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      aria-pressed={mode === "reduced" ? "false" : "true"}
      title={
        mode === "reduced"
          ? "Reduced motion is on. Click to enable animations."
          : "Full motion is on. Click to reduce animations."
      }
      className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
    >
      <span
        aria-hidden="true"
        className={`relative inline-block h-3 w-6 rounded-full border border-border transition-colors ${
          mode === "reduced" ? "bg-transparent" : "bg-accent/60"
        }`}
      >
        <span
          className={`absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-foreground transition-all duration-300 ${
            mode === "reduced" ? "left-0.5" : "left-[calc(100%-0.625rem)]"
          }`}
        />
      </span>
      <span>{label}</span>
    </button>
  );
}

/* ---------------- lead ---------------- */
