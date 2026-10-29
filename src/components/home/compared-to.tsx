import { SectionHeading } from "@/components/section-heading";
import { Container, SectionNumber } from "@/components/home/shared";

export function ComparedTo() {
  const rows: [string, string, string, string, string][] = [
    ["Runs locally", "Yes", "No", "No", "Yes"],
    ["Editable transcript", "Yes", "Yes", "Yes, in Dubbing Studio", "Yes"],
    ["Per-line / per-clip regen", "Yes", "Composition-level", "Yes, in Dubbing Studio", "Manual"],
    [
      "Speaker-aware voicing",
      "Yes",
      "Yes, manual speaker→voice map",
      "Yes, clip or track voice clone",
      "Manual",
    ],
    ["Deterministic runs", "Yes", "Not published", "Not published", "No"],
    ["Resumable jobs", "Yes", "Not published", "Not published", "No"],
    ["Programmatic access", "CLI + SDK", "Not published", "API, enterprise waitlist", "N/A"],
    ["No account required", "Yes", "No", "No", "N/A"],
  ];
  return (
    <section data-reveal className="reveal border-b border-border bg-surface">
      <Container className="py-20 sm:py-28">
        <SectionHeading
          eyebrow={<SectionNumber n="07" label="Compared to" />}
          title="Trackdub, next to how dubbing usually gets done."
        />
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="border-b border-border py-4 pr-4 font-normal"></th>
                <th className="border-b-2 border-accent bg-background px-4 py-4 font-normal text-accent">
                  Trackdub
                </th>
                <th className="border-b border-border px-4 py-4 font-normal">Descript</th>
                <th className="border-b border-border px-4 py-4 font-normal">ElevenLabs Dubbing</th>
                <th className="border-b border-border py-4 pl-4 font-normal">
                  DIY (Whisper + TTS + DAW)
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-[13px]">
              {rows.map(([label, a, b, c, d]) => (
                <tr key={label}>
                  <td className="border-b border-border py-4 pr-4 font-serif text-[16px] font-normal text-foreground">
                    {label}
                  </td>
                  <td className="border-b border-border bg-background px-4 py-4 font-medium text-foreground">
                    {a}
                  </td>
                  <td className="border-b border-border px-4 py-4 text-muted-foreground">{b}</td>
                  <td className="border-b border-border px-4 py-4 text-muted-foreground">{c}</td>
                  <td className="border-b border-border py-4 pl-4 text-muted-foreground">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Descript and ElevenLabs Dubbing feature sets per each vendor's public docs, checked July
          2026. Feature sets change; verify current before deciding.
        </p>
      </Container>
    </section>
  );
}

/* ---------------- pricing ---------------- */
