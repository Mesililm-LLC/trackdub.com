export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-6 sm:px-10 ${className}`}>{children}</div>;
}

export function SectionNumber({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-10 sm:mb-14" data-lead>
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px w-8 bg-accent" aria-hidden />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Chapter
        </span>
      </div>
      <div className="flex items-baseline gap-4 sm:gap-5">
        <span className="font-mono text-2xl leading-none tracking-tight text-accent sm:text-3xl">
          {n}
        </span>
        <span className="h-6 w-px self-center bg-border" aria-hidden />
        <span className="font-serif text-[20px] leading-tight tracking-tight text-foreground sm:text-[24px]">
          {label}
        </span>
      </div>
    </div>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-border ${className}`} aria-hidden />;
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-baseline gap-1 border-b border-foreground/30 pb-0.5 text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      {children}
    </a>
  );
}

export function InkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const base =
    "btn-sheen inline-flex items-center gap-2 px-6 py-3 text-[14px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const styles =
    variant === "primary"
      ? "border border-[var(--burgundy)] bg-[var(--burgundy)] text-[var(--cream)] hover:border-[var(--rust)] hover:bg-[var(--rust)]"
      : "border border-[var(--rust)] text-[var(--burgundy)] hover:bg-[var(--rust)] hover:text-[var(--cream)]";
  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
    </a>
  );
}

/* ---------------- masthead ---------------- */
