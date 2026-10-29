import { useState } from "react";
import { Github } from "lucide-react";
import trackdubIcon from "@/assets/trackdub-logo.svg";
import { CompanyReturnBar } from "@/components/company-identity";
import { Container, InkButton } from "@/components/home/shared";
import { GITHUB_REPO, NAV, NAV_PRIMARY } from "@/components/home/helpers";
import { MotionToggle } from "@/components/home/motion-toggle";

export function Masthead() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-border bg-background">
      <CompanyReturnBar />
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-6 px-6 sm:h-[88px] sm:px-10">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-3 font-serif text-2xl leading-none tracking-tight text-foreground sm:text-[38px]"
          aria-label="Trackdub home"
        >
          <img src={trackdubIcon} alt="" className="h-9 w-9 object-contain sm:h-12 sm:w-12" />
          <span>
            Trackdub<span className="text-accent">.</span>
          </span>
        </a>
        <nav
          className="hidden flex-1 items-center justify-center gap-x-7 md:flex"
          aria-label="Primary"
        >
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground ${
                NAV_PRIMARY.has(n.href) ? "" : "hidden"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-4 md:flex lg:gap-5">
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Trackdub on GitHub"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-5 w-5" aria-hidden="true" />
          </a>
          <div className="hidden lg:block">
            <MotionToggle />
          </div>
          <InkButton href="#waitlist">Join launch list</InkButton>
        </div>
        <button
          className="md:hidden font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <Container className="flex flex-col py-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
            <div className="py-2">
              <MotionToggle />
            </div>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" aria-hidden="true" /> GitHub
            </a>
            <InkButton href="#waitlist">Join launch list</InkButton>
          </Container>
        </div>
      )}
    </header>
  );
}

/* ---------------- motion toggle ---------------- */
