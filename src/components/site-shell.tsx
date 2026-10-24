import { Link } from "@tanstack/react-router";
import { CompanyAttribution, CompanyReturnBar } from "./company-identity";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-accent/20 selection:text-ink">
      <TopBar />
      <main>{children}</main>
      <FooterMini />
    </div>
  );
}

export function TopBar() {
  return (
    <header className="border-b border-border">
      <CompanyReturnBar />
      <Container className="flex items-center justify-between py-5">
        <Link to="/" className="font-serif text-2xl leading-none text-foreground">
          Trackdub<span className="text-accent">.</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-baseline gap-1 border-b border-foreground/30 pb-0.5 font-mono text-[12px] uppercase tracking-[0.14em] text-foreground hover:border-accent hover:text-accent"
        >
          ← Back to site
        </Link>
      </Container>
    </header>
  );
}

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
    <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
      <span className="text-accent">{n}</span>
      <span className="mx-2 text-hairline">/</span>
      <span>{label}</span>
    </div>
  );
}

export function FooterMini() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:px-10">
        <span>© 2026 Trackdub</span>
        <CompanyAttribution />
        <Link to="/" className="text-foreground hover:text-accent">
          trackdub.com
        </Link>
      </div>
    </footer>
  );
}
