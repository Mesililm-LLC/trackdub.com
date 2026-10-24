// The company site is live. Set false during a rollback to product forwarding.
const companySiteReady = import.meta.env.VITE_MESALIM_SITE_READY !== "false";
// Avoid the old root 301 cached by returning browsers during the domain cutover.
const companyOrigin = "https://mesalim.com/?from=trackdub";

export function CompanyReturnBar() {
  if (!companySiteReady) return null;
  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto flex min-h-11 max-w-[1600px] items-center justify-between gap-4 px-6 font-mono text-[11px] uppercase tracking-[0.12em] sm:px-10">
        <a
          href={companyOrigin}
          aria-label="Back to Mesalim company site"
          className="inline-flex min-h-11 items-center text-foreground hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          ← Mesalim
        </a>
        <span className="text-muted-foreground">Company &amp; open source</span>
      </div>
    </div>
  );
}

export function CompanyAttribution({ className = "" }: { className?: string }) {
  return (
    <p
      className={`font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground ${className}`}
    >
      {companySiteReady ? (
        <a
          href={companyOrigin}
          className="inline-flex min-h-11 items-center hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          A Mesalim product →
        </a>
      ) : (
        "A Mesalim product"
      )}
    </p>
  );
}
