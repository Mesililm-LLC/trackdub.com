import { Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/section-heading";
import { FAQ_ITEMS } from "@/components/home/faq-items";
import { Container, Rule, SectionNumber, TextLink } from "@/components/home/shared";

export function FAQ() {
  const items = FAQ_ITEMS;
  return (
    <section id="faq" data-reveal className="reveal border-b border-border bg-surface">
      <Container className="py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow={<SectionNumber n="09" label="Questions" />}
              title="Straight answers."
              lead={
                <>
                  Not covered here? Write to{" "}
                  <TextLink href="mailto:hello@trackdub.com">hello@trackdub.com</TextLink>.
                </>
              }
              h2ClassName="mt-6 font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl"
              leadClassName="mt-6 text-[16px] leading-relaxed text-muted-foreground"
            />
            <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
              New to how AI dubbing works stage by stage? Read the{" "}
              <Link
                to="/guides/ai-dubbing-guide"
                className="inline-flex items-baseline gap-1 border-b border-foreground/30 pb-0.5 text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                AI dubbing guide
              </Link>
              . Data handling is covered in full in the{" "}
              <Link
                to="/privacy"
                className="inline-flex items-baseline gap-1 border-b border-foreground/30 pb-0.5 text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                privacy policy
              </Link>
              .
            </p>
          </div>
          <dl className="lg:col-span-8">
            {items.map((it, i) => (
              <div key={it.q} data-reveal-child className="reveal-child">
                {i > 0 && <Rule />}
                <div className="grid gap-4 py-6 md:grid-cols-[220px_1fr] md:gap-8">
                  <dt className="font-serif text-[20px] leading-snug text-foreground">
                    <span className="mr-2 font-mono text-[11px] text-accent" aria-hidden>
                      Q.{String(i + 1).padStart(2, "0")}
                    </span>
                    {it.q}
                  </dt>
                  <dd className="text-[16px] leading-relaxed text-muted-foreground">{it.a}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- endnote ---------------- */
