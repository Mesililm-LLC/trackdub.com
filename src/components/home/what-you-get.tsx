import { SectionHeading } from "@/components/section-heading";
import { Container, SectionNumber } from "@/components/home/shared";
import { replayStamp } from "@/components/home/helpers";

export function WhatYouGet() {
  const items: [string, string][] = [
    [
      "Local by default",
      "Media, transcripts, voice references, and generated audio stay on your disk. Cloud is opt-in per project, per stage.",
    ],
    [
      "Deterministic runs",
      "Same project manifest + same models = same output. Every stage records what it consumed.",
    ],
    [
      "Resumable jobs",
      "Kill the app mid-run. Reopen the project. Continue from the last completed stage.",
    ],
    [
      "Per-line regen",
      "Regenerate one voice line, one speaker, or one stage. Never a full-project redo for a small fix.",
    ],
    [
      "Editable script",
      "Transcript and translation are real documents with a glossary, not opaque intermediates.",
    ],
    [
      "Voice cloning per speaker",
      "One short reference per speaker. No shared 'AI voice' for the whole video.",
    ],
    [
      "Source separation",
      "Vocal and instrumental stems are split out, kept, and ducked under dialogue automatically. Or manually, if you prefer.",
    ],
    [
      "Lip sync",
      "Optional viseme-matched lip sync for on-camera speakers. Off by default, gated by license lane.",
    ],
    [
      "Open model manifest",
      "Every bundled model, its license lane, and its checksum is declared in one JSON file.",
    ],
    [
      "CLI and SDK",
      "The same pipeline the app runs is scriptable for batch, CI, or on-prem automation.",
    ],
    ["Cross-platform", "Windows, macOS, Linux. Same project format. Same output."],
    [
      "Open-core engine",
      "Domain, application, inference, SDK, and CLI ship Apache 2.0. The desktop app and licensing layer are source-visible.",
    ],
  ];
  return (
    <section id="manifest" data-reveal className="reveal scroll-mt-24 border-b border-border">
      <Container className="py-20 sm:py-28">
        <SectionHeading
          eyebrow={<SectionNumber n="06" label="The manifest" />}
          title="A workstation, not a wrapper around a model."
          lead="Trackdub declares every bundled model in a manifest: source, checksum, license lane. Here's the same idea applied to the product itself: everything in the box, itemized."
          leadClassName="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground"
        />
        <div className="relative mt-14 border-2 border-foreground bg-background">
          <div
            aria-hidden
            onClick={replayStamp}
            className="stamp-in absolute -top-5 right-6 hidden cursor-pointer select-none rotate-[-6deg] border-4 border-double border-accent bg-background px-4 py-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-accent sm:block sm:right-12"
            title="Stamp it again"
          >
            Commercial-safe
            <br />
            all tiers ✓
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-foreground px-5 py-4 sm:px-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground">
              Trackdub · shipping manifest
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Items: {items.length} · Rev. early preview
            </span>
          </div>
          <ol className="grid md:grid-cols-2">
            {items.map(([term, def], i) => (
              <li
                key={term}
                data-reveal-child
                className="reveal-child group flex gap-4 border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-surface/50 sm:px-8 md:[&:nth-last-child(2)]:border-b-0 md:odd:border-r"
              >
                <span className="pt-1 font-mono text-[11px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="font-serif text-[19px] leading-snug text-foreground">{term}</div>
                  <div className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                    {def}
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-foreground px-5 py-3 sm:px-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Models declared in bundled-models.manifest.json · source · checksum · license lane
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Nothing research-only ships as a default
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- compared to ---------------- */
