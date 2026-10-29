import { Container, SectionNumber } from "@/components/home/shared";
import { round3 } from "@/components/home/helpers";

export function ProductPlate() {
  return (
    <section className="border-b border-border">
      <Container className="py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
          <div>
            <SectionNumber n="01a" label="The workstation" />
            <p className="max-w-sm text-[16px] leading-relaxed text-muted-foreground">
              The interface is being built around the pipeline itself: source media, editable
              stages, and the exact state of every run in one place.
            </p>
          </div>
          <div>
            <figure className="overflow-hidden border border-border">
              <img
                src="/screenshots/app-shell-early-build.png"
                alt="Trackdub desktop dubbing workstation with pipeline controls, video preview, translated segments, and per-line playback controls"
                className="w-full"
                loading="lazy"
                width={1920}
                height={1050}
              />
            </figure>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Fig. 02 &nbsp;·&nbsp; Actual desktop shell, early build. Pre-release UI; chrome and
              copy are still moving.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function WorkstationMock() {
  const bg = "oklch(0.16 0.010 250)";
  const panel = "oklch(0.20 0.012 250)";
  const inkText = "oklch(0.92 0.005 240)";
  const dim = "oklch(0.62 0.02 245)";
  return (
    <figure
      className="overflow-hidden border border-border shadow-panel"
      style={{ backgroundColor: bg, color: inkText }}
    >
      {/* titlebar */}
      <div
        className="flex items-center justify-between border-b px-4 py-2 font-mono text-[11px]"
        style={{ borderColor: "oklch(0.28 0.014 250)", backgroundColor: panel, color: dim }}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: "oklch(0.55 0.02 250)" }} />
            <span className="h-2 w-2 rounded-full" style={{ background: "oklch(0.55 0.02 250)" }} />
            <span className="h-2 w-2 rounded-full" style={{ background: "oklch(0.55 0.02 250)" }} />
          </span>
          <span>Project &nbsp; Kyoto Doc</span>
        </div>
        <div className="flex items-center gap-5">
          <span>ja → en &nbsp;·&nbsp; 24 fps</span>
          <span>Autosave 10:42:11 &nbsp;●</span>
        </div>
      </div>

      <div className="grid grid-cols-12">
        {/* left: stages */}
        <div className="col-span-3 border-r p-4" style={{ borderColor: "oklch(0.28 0.014 250)" }}>
          <div
            className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: dim }}
          >
            Run
          </div>
          <ol className="space-y-1.5">
            {[
              ["01", "Ingest", "done"],
              ["02", "Transcribe", "done"],
              ["03", "Translate", "done"],
              ["04", "Diarize", "active"],
              ["05", "Voice", "queued"],
              ["06", "Mix", "queued"],
            ].map(([n, name, s]) => (
              <li
                key={n}
                className="flex items-center gap-3 py-1 font-mono text-[12px]"
                style={{ color: s === "queued" ? dim : inkText }}
              >
                <span style={{ color: dim }}>{n}</span>
                <span className="flex-1">{name}</span>
                <span
                  style={{
                    color:
                      s === "done"
                        ? "oklch(0.75 0.13 155)"
                        : s === "active"
                          ? "oklch(0.68 0.15 258)"
                          : dim,
                  }}
                >
                  {s === "done" ? "✓" : s === "active" ? "●" : "·"}
                </span>
              </li>
            ))}
          </ol>
          <div
            className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: dim }}
          >
            Provider
          </div>
          <div className="mt-2 font-mono text-[12px]">DirectML · RTX 4070</div>
          <div
            className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: dim }}
          >
            Manifest
          </div>
          <div className="mt-2 font-mono text-[12px]">bundled · commercial</div>
        </div>

        {/* center: script */}
        <div className="col-span-6 border-r p-5" style={{ borderColor: "oklch(0.28 0.014 250)" }}>
          <div className="mb-3 flex items-center justify-between">
            <div
              className="font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: dim }}
            >
              Script · line 42
            </div>
            <div className="font-mono text-[10px]" style={{ color: dim }}>
              S1 Anna · 00:42.180
            </div>
          </div>
          <div className="space-y-2">
            {[
              {
                t: "00:34",
                s: "S2",
                de: "京都の朝は静かに始まる。",
                en: "Kyoto wakes quietly.",
                a: false,
              },
              {
                t: "00:38",
                s: "S1",
                de: "Wir haben die Pipeline neu gebaut,",
                en: "We rebuilt the pipeline,",
                a: false,
              },
              {
                t: "00:42",
                s: "S1",
                de: "damit jede Stufe editierbar bleibt.",
                en: "so every stage stays editable.",
                a: true,
              },
              {
                t: "00:46",
                s: "S2",
                de: "Und wenn etwas nicht stimmt …",
                en: "And if something is off …",
                a: false,
              },
              {
                t: "00:49",
                s: "S2",
                de: "regenerierst du nur diese eine Zeile.",
                en: "you regenerate just that one line.",
                a: false,
              },
            ].map((r) => (
              <div key={r.t} className="grid grid-cols-[52px_28px_1fr] gap-3 py-1">
                <span className="font-mono text-[11px]" style={{ color: dim }}>
                  {r.t}
                </span>
                <span
                  className="font-mono text-[10px]"
                  style={{ color: r.s === "S1" ? "oklch(0.68 0.15 258)" : "oklch(0.70 0.12 190)" }}
                >
                  {r.s}
                </span>
                <div>
                  <div className="text-[12px]" style={{ color: dim }}>
                    {r.de}
                  </div>
                  <div
                    className="font-serif text-[16px] leading-snug"
                    style={{
                      color: r.a ? "oklch(0.97 0.005 240)" : inkText,
                      textDecoration: r.a ? "underline" : "none",
                      textDecorationColor: "oklch(0.68 0.15 258)",
                      textUnderlineOffset: 4,
                    }}
                  >
                    {r.en}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* waveform */}
          <div className="mt-4">
            <div
              className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: dim }}
            >
              <span>Waveform</span>
              <span>−14.1 LUFS</span>
            </div>
            <svg viewBox="0 0 600 60" className="h-14 w-full" preserveAspectRatio="none">
              {Array.from({ length: 120 }).map((_, i) => {
                const seed = Math.sin(i * 1.37) * Math.cos(i * 0.51);
                const h = round3(8 + Math.abs(seed) * 42);
                const isActive = i > 44 && i < 78;
                return (
                  <rect
                    key={i}
                    x={i * 5}
                    y={30 - h / 2}
                    width={2.2}
                    height={h}
                    fill={isActive ? "oklch(0.72 0.15 258)" : "oklch(0.55 0.03 240)"}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* right: active stage and line metadata */}
        <div className="col-span-3 p-4">
          <div
            className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: dim }}
          >
            Stage
          </div>
          {[
            ["Ingest", "Done", "oklch(0.75 0.13 155)"],
            ["Transcribe", "Done", "oklch(0.75 0.13 155)"],
            ["Translate", "Done", "oklch(0.75 0.13 155)"],
            ["Voice", "In progress", "oklch(0.74 0.17 62)"],
            ["Align", "Pending", dim],
            ["Mix", "Pending", dim],
            ["Export", "Pending", dim],
          ].map(([name, status, color]) => (
            <div
              key={name}
              className="flex items-center justify-between gap-3 py-1.5 font-mono text-[10px]"
            >
              <span className="flex items-center gap-2" style={{ color: inkText }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                {name}
              </span>
              <span style={{ color }}>{status}</span>
            </div>
          ))}
          <div
            className="mt-5 border-t pt-4 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ borderColor: "oklch(0.28 0.014 250)", color: dim }}
          >
            Line 004
          </div>
          <dl className="mt-3 space-y-2 font-mono text-[10px]">
            {[
              ["Speaker", "Anna"],
              ["Start", "00:00:42.18"],
              ["Duration", "00:00:03.20"],
              ["Status", "Voiced"],
              ["Voice", "Anna (EN)"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt style={{ color: dim }}>{k}</dt>
                <dd style={{ color: k === "Voice" ? "oklch(0.74 0.17 62)" : inkText }}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="border-t px-4 py-3" style={{ borderColor: "oklch(0.28 0.014 250)" }}>
        <div
          className="mb-2 grid grid-cols-[80px_1fr] gap-3 font-mono text-[9px]"
          style={{ color: dim }}
        >
          <span>00:00:00</span>
          <div className="flex justify-between">
            <span>00:00:05</span>
            <span>00:00:10</span>
            <span>00:00:15</span>
            <span>00:00:20</span>
            <span>00:00:25</span>
          </div>
        </div>
        {["Source ref", "Dialogue", "Music bed", "SFX"].map((track, trackIndex) => (
          <div
            key={track}
            className="grid grid-cols-[80px_1fr] items-center gap-3 border-t py-1.5"
            style={{ borderColor: "oklch(0.25 0.014 250)" }}
          >
            <span
              className="font-mono text-[9px]"
              style={{ color: trackIndex === 1 ? "oklch(0.74 0.17 62)" : dim }}
            >
              {track}
            </span>
            <svg viewBox="0 0 600 18" className="h-4 w-full" preserveAspectRatio="none">
              {Array.from({ length: 100 }).map((_, i) => {
                const signal = round3(
                  2 +
                    Math.abs(Math.sin((i + trackIndex * 5) * 0.83) * Math.cos(i * 0.17)) *
                      (trackIndex === 1 ? 14 : 9),
                );
                return (
                  <rect
                    key={i}
                    x={i * 6}
                    y={(18 - signal) / 2}
                    width="2.4"
                    height={signal}
                    fill={trackIndex === 1 ? "oklch(0.72 0.15 50)" : "oklch(0.48 0.02 245)"}
                  />
                );
              })}
              {trackIndex === 1 && (
                <line
                  x1="280"
                  x2="280"
                  y1="0"
                  y2="18"
                  stroke="oklch(0.78 0.17 62)"
                  strokeWidth="1"
                />
              )}
            </svg>
          </div>
        ))}
      </div>
    </figure>
  );
}

/* ---------------- trust strip ---------------- */
