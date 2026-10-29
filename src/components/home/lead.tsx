import { useEffect, useRef } from "react";
import { CompanyAttribution } from "@/components/company-identity";
import { InkButton } from "@/components/home/shared";
import { round3 } from "@/components/home/helpers";
import { WorkstationMock } from "@/components/home/product-plate";

export function Lead() {
  return (
    <section id="top" className="border-b border-border">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-12 sm:px-10 sm:py-9 lg:pb-8 lg:pt-9">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-10 xl:gap-14">
          <div>
            <CompanyAttribution className="mb-4" />
            <h1 className="font-serif text-5xl leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-[68px] xl:text-[76px]">
              Dub videos into other languages without giving up control
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-muted-foreground sm:text-lg">
              Trackdub is a desktop workstation for translating, voicing, and mixing video. Every
              stage of the pipeline is inspectable, editable, and rerunnable, from the transcript to
              the final mix. Your media never leaves your machine unless you say so.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4 sm:gap-6">
              <InkButton href="#waitlist">
                Be first to know <span aria-hidden>→</span>
              </InkButton>
              <InkButton href="#pipeline" variant="ghost">
                Explore the workflow <span aria-hidden>→</span>
              </InkButton>
            </div>
          </div>
          <div className="hidden lg:block">
            <WorkstationMock />
          </div>
        </div>
        <HeroPulseRail />
      </div>
    </section>
  );
}

export function HeroPulseRail() {
  const tcRef = useRef<HTMLSpanElement | null>(null);

  // Ticking timecode, 24 fps. Direct textContent writes; no React re-renders.
  // Holds still while reduce-motion is active (checked per tick so the header
  // toggle takes effect immediately, no listener bookkeeping).
  useEffect(() => {
    let frame = 14 * 24 + 12; // matches the initial 00:00:14:12
    const iv = window.setInterval(() => {
      if (document.documentElement.classList.contains("reduce-motion")) return;
      frame = (frame + 1) % (60 * 60 * 24);
      const total = Math.floor(frame / 24);
      const mm = String(Math.floor(total / 60)).padStart(2, "0");
      const ss = String(total % 60).padStart(2, "0");
      const ff = String(frame % 24).padStart(2, "0");
      if (tcRef.current) tcRef.current.textContent = `00:${mm}:${ss}:${ff}`;
    }, 1000 / 24);
    return () => window.clearInterval(iv);
  }, []);

  return (
    <div className="my-8 flex items-center gap-4" aria-hidden="true">
      <span ref={tcRef} className="font-mono text-[9px] tracking-[0.14em] tabular-nums text-accent">
        00:00:14:12
      </span>
      <div className="relative min-w-0 flex-1 basis-0 overflow-hidden">
        <svg viewBox="0 0 1000 20" className="h-5 w-full" preserveAspectRatio="none">
          {Array.from({ length: 160 }).map((_, i) => {
            const energy = round3(
              Math.max(1, Math.abs(Math.sin(i * 0.73) * Math.cos(i * 0.19)) * 15),
            );
            return (
              <rect
                key={i}
                x={i * 6.25}
                y={(20 - energy) / 2}
                width="1"
                height={energy}
                fill="currentColor"
                className="text-accent"
                opacity={Math.max(0.16, 1 - i / 190)}
              />
            );
          })}
        </svg>
        <div className="playhead-wrap pointer-events-none absolute inset-0">
          <span className="absolute inset-y-0 left-0 w-px bg-accent/70" />
        </div>
      </div>
    </div>
  );
}

/* ---------------- resumable job ---------------- */
