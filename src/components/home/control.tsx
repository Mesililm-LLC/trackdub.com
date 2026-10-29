import type { ReactNode } from "react";
import { Container, SectionNumber } from "@/components/home/shared";

export function Control() {
  return (
    <section id="control" data-reveal className="reveal border-b border-border">
      <Container className="py-20 sm:py-28">
        <SectionNumber n="03b" label="You can fix anything, and only that thing" />
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              You changed one line. Only one line regenerates.
            </h2>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted-foreground">
              Change it. The translation invalidates. The affected voice line queues for a regen.
              Every other line stays exactly as it was: same take, same timing, same mix. That's the
              whole idea.
            </p>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <ControlPlate
              tag="Before edit"
              t="00:42.180"
              text="so every stage stays editable."
              hint="Auto-generated · pace 1.00× · pause 200 ms"
            />
            <ControlPlate
              tag="After text + prosody edit"
              t="00:42.180"
              text={
                <>
                  so every stage <span className="border-b-2 border-accent">remains editable</span>.
                </>
              }
              hint="Regen · pace 0.94× · pause 320 ms · this line only"
              accent
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

function ControlPlate({
  tag,
  t,
  text,
  hint,
  accent = false,
}: {
  tag: string;
  t: string;
  text: ReactNode;
  hint: string;
  accent?: boolean;
}) {
  return (
    <figure className="border border-border bg-card p-5">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span className={accent ? "text-accent" : ""}>{tag}</span>
        <span>{t}</span>
      </div>
      <div className="mt-4 font-serif text-2xl leading-snug text-foreground">"{text}"</div>
      <figcaption className="mt-4 font-mono text-[11px] text-muted-foreground">{hint}</figcaption>
    </figure>
  );
}

/* ---------------- performance ---------------- */
