import { Link } from "@tanstack/react-router";
import { Container, TextLink } from "@/components/home/shared";
import { WaitlistForm } from "@/components/home/waitlist-form";

export function Endnote() {
  return (
    <section id="waitlist" data-reveal className="reveal border-b border-border">
      <Container className="py-24 sm:py-36 text-center">
        <p className="mx-auto max-w-3xl font-serif text-4xl leading-[1.12] tracking-tight text-foreground sm:text-5xl">
          Dub this in Spanish. Keep the original music. Regenerate line 42 with slower prosody. Ship
          it before lunch.
        </p>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
          Interested in Trackdub? Join the launch list and be the first to know when downloads,
          release notes, and preview invitations are ready.
        </p>
        <WaitlistForm />
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          <TextLink href="mailto:hello@trackdub.com">Talk to us →</TextLink>
        </div>
        <p className="mx-auto mt-10 max-w-xl font-mono text-[11px] uppercase tracking-[0.14em] leading-relaxed text-muted-foreground">
          Evaluating Trackdub for a program, fund, or partnership?{" "}
          <a
            href="mailto:press@trackdub.com"
            className="border-b border-foreground/30 pb-0.5 text-foreground hover:border-accent hover:text-accent"
          >
            press@trackdub.com
          </a>{" "}
          · building in public:{" "}
          <Link
            to="/changelog"
            className="border-b border-foreground/30 pb-0.5 text-foreground hover:border-accent hover:text-accent"
          >
            read the changelog
          </Link>
        </p>
      </Container>
    </section>
  );
}

/* ---------------- waitlist ---------------- */
