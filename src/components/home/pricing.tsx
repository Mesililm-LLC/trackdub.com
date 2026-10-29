import { Link } from "@tanstack/react-router";
import { PRICING_PLANS } from "@/lib/pricing";
import { PlanCard } from "@/components/plan-card";
import { Container, SectionNumber } from "@/components/home/shared";

export function Pricing() {
  const plans = PRICING_PLANS;
  return (
    <section id="pricing" data-reveal className="reveal border-b border-border">
      <Container className="py-20 sm:py-28">
        <SectionNumber n="08" label="Pricing" />
        <h2 className="mt-6 max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Three ways to run it. All of them local-first.
        </h2>
        <ul
          role="list"
          className="mt-14 grid list-none divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0"
        >
          {plans.map((p) => (
            <PlanCard
              key={p.name}
              plan={p}
              className="card-lift group relative p-8 transition-colors hover:bg-surface/50 focus-within:bg-surface/50 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-background"
              ctaClassName="inline-flex items-baseline gap-1 rounded-sm border-b border-foreground/40 pb-0.5 text-foreground outline-none hover:border-accent hover:text-accent focus-visible:outline-none"
            />
          ))}
        </ul>
        <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
          <Link
            to="/pricing"
            className="border-b border-foreground/30 pb-0.5 text-foreground hover:border-accent hover:text-accent"
          >
            Full pricing, license terms, and FAQ →
          </Link>
        </p>
      </Container>
    </section>
  );
}

/* ---------------- faq ---------------- */
