export function TrustStrip() {
  const items = [
    "Local by default",
    "Deterministic runs",
    "Cross-platform",
    "Open manifest",
    "No account required",
    "Per-line regen",
    "Resumable jobs",
    "CPU fallback, always",
    "Your disk, your files",
  ];
  return (
    <section data-reveal className="reveal border-b border-border bg-surface">
      <p className="sr-only">{items.join(". ")}.</p>
      <div className="ticker-mask overflow-hidden py-5" aria-hidden>
        <div className="ticker-track flex w-max items-center">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex items-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
            >
              {items.map((t) => (
                <span key={t} className="flex items-center whitespace-nowrap">
                  <span className="px-6">{t}</span>
                  <span className="text-accent">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- pipeline feature ---------------- */
