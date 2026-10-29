import { Rule } from "@/components/home/shared";
import { STAGES } from "@/components/home/pipeline-stages";
import { HeroPulseRail } from "@/components/home/lead";

export function PipelineFeature() {
  const facts = [
    ["Platforms", "Windows · macOS · Linux"],
    ["Acceleration", "TensorRT RTX · CUDA · DirectML · CoreML · MIGraphX · OpenVINO · QNN · CPU"],
    ["Data", "Local by default · cloud providers opt in per stage"],
  ];

  return (
    <section id="pipeline" data-reveal className="reveal border-b border-border">
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10">
        <div className="grid border-b border-border lg:grid-cols-[220px_320px_1fr]">
          <div className="flex items-center border-b border-border py-8 lg:border-b-0 lg:border-r lg:py-10">
            <span className="font-serif text-[112px] leading-[0.75] tracking-[-0.06em] text-[var(--burgundy)] sm:text-[150px]">
              01
            </span>
          </div>
          <div className="border-b border-border py-8 lg:border-b-0 lg:border-r lg:px-9 lg:py-10">
            <HeroPulseRail />
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--rust)]">
              The pipeline
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
              A clear, inspectable path from source media to final mix. Nothing is hidden.
            </p>
          </div>
          <div className="flex items-center py-8 lg:px-12 lg:py-10">
            <div>
              <h2 className="font-serif text-4xl leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Built for control at every stage.
              </h2>
              <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
                Review every line. Tweak every take. Rerun only what changed. You are always in
                control.
              </p>
            </div>
          </div>
        </div>

        <dl className="grid border-b border-border md:grid-cols-[1fr_2fr_1fr]">
          {facts.map(([k, v], index) => (
            <div
              key={k}
              className={`flex min-h-24 flex-col items-center justify-center gap-2 px-5 py-5 text-center font-mono text-[11px] ${
                index > 0 ? "border-t border-border md:border-l md:border-t-0" : ""
              }`}
            >
              <dt className="uppercase tracking-[0.16em] text-muted-foreground">{k}</dt>
              <dd className="max-w-xl leading-relaxed text-foreground">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-14 py-20 lg:grid-cols-12 lg:gap-16 sm:py-24">
          <div className="lg:col-span-5">
            <h3 className="font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              Six stages. Each one editable, each one rerunnable.
            </h3>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted-foreground">
              A dubbed video is not a single button. It's a chain of decisions: what someone said,
              what it should say in the target language, whose voice says it, and how it sits in the
              mix. Trackdub exposes that chain, so you can inspect any link and change it in place.
            </p>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted-foreground">
              Every stage declares what it needs from the previous one. If you edit the transcript,
              the translation knows to invalidate. If you change a speaker's voice reference, only
              their lines regenerate. Nothing rebuilds that doesn't have to.
            </p>
          </div>
          <ol className="lg:col-span-7">
            {STAGES.map((s, i) => (
              <li key={s.n}>
                {i > 0 && <Rule />}
                <a
                  href={`#stage-${s.n}`}
                  className="group grid grid-cols-[64px_1fr_auto] items-baseline gap-4 py-6 transition-colors hover:bg-surface/60"
                >
                  <span className="font-mono text-[13px] text-accent">{s.n}</span>
                  <div>
                    <div className="font-serif text-2xl text-foreground">{s.name}</div>
                    <div className="mt-1 font-mono text-[12px] text-muted-foreground">{s.one}</div>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground group-hover:text-accent">
                    Read →
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------------- stage chapters ---------------- */

/* ---------------- interactive walkthrough ---------------- */
