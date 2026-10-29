import type { ReactNode } from "react";
import { Container, SectionNumber } from "@/components/home/shared";
import { STAGES } from "@/components/home/pipeline-stages";

export function StageChapters() {
  return (
    <section data-reveal className="reveal border-b border-border bg-surface">
      <Container className="py-20 sm:py-28">
        <SectionNumber n="03" label="Each stage, in detail" />
        <h2 className="mt-2 font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Open the hood on any stage.
        </h2>
        <div className="mt-14 space-y-16 lg:space-y-24">
          {STAGES.map((s, i) => {
            const flipped = i % 2 === 1;
            return (
              <article
                key={s.n}
                id={`stage-${s.n}`}
                className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16"
              >
                <header className={`lg:col-span-5 ${flipped ? "lg:order-2" : ""}`}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-[44px] leading-none tracking-tight text-accent/80 sm:text-[56px]">
                      {s.n}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                      {s.name}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl">
                    {s.one}
                  </h3>
                  <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground">{s.body}</p>
                  <ul className="mt-6 space-y-2 font-mono text-[12px] text-muted-foreground">
                    {s.detail.map((d) => (
                      <li key={d} className="flex gap-3">
                        <span className="text-accent">·</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </header>
                <div
                  className={`lg:col-span-7 ${flipped ? "lg:order-1" : ""} ${i > 0 ? "lg:mt-6" : ""}`}
                >
                  <StageInset stage={s.name} index={i} />
                  <p
                    className={`mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground ${flipped ? "lg:text-right" : ""}`}
                  >
                    Fig. 0{i + 2} &nbsp;·&nbsp; {s.name} view
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function StageInset({ stage, index }: { stage: string; index: number }) {
  const bg = "oklch(0.16 0.010 250)";
  const border = "oklch(0.28 0.014 250)";
  const dim = "oklch(0.62 0.02 245)";
  const ink = "oklch(0.94 0.005 240)";

  const content = () => {
    switch (stage) {
      case "Ingest":
        return (
          <div className="p-5 font-mono text-[12px]" style={{ color: dim }}>
            <div className="mb-3 uppercase tracking-[0.14em] text-[10px]">Media probe</div>
            <table className="w-full">
              <tbody>
                {[
                  ["container", "mp4 / h264 / aac"],
                  ["duration", "00:03:18.240"],
                  ["fps", "23.976"],
                  ["audio", "stereo · 48 kHz"],
                  ["scenes", "42 detected"],
                  ["speech", "84% (VAD)"],
                  ["loudness", "−14.1 LUFS"],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td className="border-b py-1.5 pr-6" style={{ borderColor: border }}>
                      {k}
                    </td>
                    <td
                      className="border-b py-1.5 text-right"
                      style={{ borderColor: border, color: ink }}
                    >
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "Transcribe":
        return (
          <div className="p-5 text-[12px]" style={{ color: ink }}>
            <div
              className="mb-3 font-mono uppercase tracking-[0.14em] text-[10px]"
              style={{ color: dim }}
            >
              Source transcript · de-DE
            </div>
            {[
              ["00:38.120", "Wir haben die", "Pipeline", " neu gebaut,"],
              ["00:42.180", "damit jede Stufe", "editierbar", " bleibt."],
              ["00:46.900", "Und wenn etwas nicht", "stimmt", " …"],
            ].map(([t, a, hi, b]) => (
              <div key={t} className="flex gap-4 py-1.5">
                <span className="font-mono" style={{ color: dim }}>
                  {t}
                </span>
                <span>
                  {a}{" "}
                  <span style={{ background: "oklch(0.68 0.14 50 / 0.25)", padding: "0 2px" }}>
                    {hi}
                  </span>
                  {b}
                </span>
              </div>
            ))}
          </div>
        );
      case "Translate":
        return (
          <div className="p-5 text-[12px]" style={{ color: ink }}>
            <div
              className="mb-3 grid grid-cols-2 gap-6 font-mono uppercase tracking-[0.14em] text-[10px]"
              style={{ color: dim }}
            >
              <span>Source · de-DE</span>
              <span>Target · en-US</span>
            </div>
            {[
              ["Wir haben die Pipeline neu gebaut,", "We rebuilt the pipeline"],
              ["damit jede Stufe editierbar bleibt.", "so every stage stays editable."],
              ["Und wenn etwas nicht stimmt …", "And if something's off …"],
            ].map(([a, b], i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-6 border-b py-2"
                style={{ borderColor: border }}
              >
                <span style={{ color: dim }}>{a}</span>
                <span className="font-serif text-[15px]">{b}</span>
              </div>
            ))}
            <div
              className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: dim }}
            >
              Glossary · 12 terms locked
            </div>
          </div>
        );
      case "Diarize":
        return (
          <div className="p-5 text-[12px]" style={{ color: ink }}>
            <div
              className="mb-3 font-mono uppercase tracking-[0.14em] text-[10px]"
              style={{ color: dim }}
            >
              Speakers detected
            </div>
            {[
              { n: "Anna", turns: 24, c: "oklch(0.68 0.15 258)" },
              { n: "Mateo", turns: 18, c: "oklch(0.70 0.12 190)" },
              { n: "Speaker 3", turns: 2, c: "oklch(0.55 0.03 240)" },
            ].map((s) => (
              <div
                key={s.n}
                className="flex items-center justify-between border-b py-3"
                style={{ borderColor: border }}
              >
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full" style={{ background: s.c }} />
                  <div>
                    <div>{s.n}</div>
                    <div className="font-mono text-[10px]" style={{ color: dim }}>
                      {s.turns} turns · 4.2s reference
                    </div>
                  </div>
                </div>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: dim }}
                >
                  Rename · Merge
                </span>
              </div>
            ))}
          </div>
        );
      case "Voice":
        return (
          <div className="p-5 text-[12px]" style={{ color: ink }}>
            <div
              className="mb-3 flex items-center justify-between font-mono uppercase tracking-[0.14em] text-[10px]"
              style={{ color: dim }}
            >
              <span>Line 42 · Anna</span>
              <span>duration 3.14s / target 3.20s</span>
            </div>
            <div className="font-serif text-[17px] leading-snug">
              "so every stage stays{" "}
              <span style={{ borderBottom: "2px solid oklch(0.68 0.15 258)" }}>editable</span>."
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-[11px]">
              {[
                ["Pace", "0.98×"],
                ["Emphasis", "editable"],
                ["Pause after", "220 ms"],
              ].map(([k, v]) => (
                <div key={k} className="border p-2" style={{ borderColor: border }}>
                  <div className="uppercase tracking-[0.14em] text-[9px]" style={{ color: dim }}>
                    {k}
                  </div>
                  <div className="mt-1">{v}</div>
                </div>
              ))}
            </div>
            <div
              className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: dim }}
            >
              [ Regenerate line ] &nbsp; [ Regenerate speaker ]
            </div>
          </div>
        );
      case "Mix":
        return (
          <div className="p-5 text-[12px]" style={{ color: ink }}>
            <div
              className="mb-3 font-mono uppercase tracking-[0.14em] text-[10px]"
              style={{ color: dim }}
            >
              Timeline
            </div>
            {[
              ["Dialogue EN", "oklch(0.68 0.15 258)", [10, 22, 34, 55, 70, 82]],
              ["Music", "oklch(0.55 0.06 220)", [5, 95]],
              ["SFX", "oklch(0.55 0.03 240)", [40, 62]],
            ].map(([label, color, pts]) => (
              <div key={label as string} className="mb-3">
                <div
                  className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: dim }}
                >
                  {label as string}
                </div>
                <div
                  className="relative h-5 w-full"
                  style={{ background: "oklch(0.20 0.012 250)" }}
                >
                  {(pts as number[]).reduce<ReactNode[]>((acc, p, i, arr) => {
                    if (i % 2 === 1) return acc;
                    const next = arr[i + 1] ?? p + 8;
                    acc.push(
                      <span
                        key={i}
                        className="absolute top-0 h-full"
                        style={{
                          left: `${p}%`,
                          width: `${next - p}%`,
                          background: color as string,
                          opacity: 0.85,
                        }}
                      />,
                    );
                    return acc;
                  }, [])}
                </div>
              </div>
            ))}
            <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-[11px]">
              {[
                ["Loudness", "−16 LUFS"],
                ["Duck", "−9 dB"],
                ["Export", "mp4 + stems"],
              ].map(([k, v]) => (
                <div key={k} className="border p-2" style={{ borderColor: border }}>
                  <div className="uppercase tracking-[0.14em] text-[9px]" style={{ color: dim }}>
                    {k}
                  </div>
                  <div className="mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border border-border shadow-panel" style={{ background: bg }}>
      <div
        className="flex items-center justify-between border-b px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{ borderColor: border, color: dim, background: "oklch(0.20 0.012 250)" }}
      >
        <span>Trackdub · {stage.toLowerCase()}</span>
        <span>{String(index + 1).padStart(2, "0")} of 06</span>
      </div>
      {content()}
    </div>
  );
}

/* ---------------- control ---------------- */
