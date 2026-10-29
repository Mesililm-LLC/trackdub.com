import { Github } from "lucide-react";
import trackdubIcon from "@/assets/trackdub-logo.svg";
import { CompanyAttribution } from "@/components/company-identity";
import { Container, Rule } from "@/components/home/shared";
import { GITHUB_REPO } from "@/components/home/helpers";

export function Colophon() {
  const cols: [string, [string, string][]][] = [
    [
      "Product",
      [
        ["Pipeline", "#pipeline"],
        ["Control", "#control"],
        ["Resumable jobs", "#resume"],
        ["Performance", "#performance"],
        ["Architecture", "#architecture"],
        ["Requirements", "#requirements"],
        ["Pricing", "/pricing"],
        ["Changelog", "/changelog"],
      ],
    ],
    [
      "Resources",
      [
        ["Guides", "/guides"],
        ["AI dubbing guide", "/guides/ai-dubbing-guide"],
        ["Docs", "/docs"],
        ["Local-first checklist", "/downloads/trackdub-local-first-dubbing-checklist.pdf"],
      ],
    ],
    [
      "Developers",
      [
        ["CLI", "/docs#quickstart"],
        ["SDK", "/docs"],
        ["REST API", "/docs"],
        ["Model manifest", "/docs#manifest"],
      ],
    ],
    [
      "Company",
      [
        ["Contact", "mailto:hello@trackdub.com"],
        ["Press", "mailto:press@trackdub.com"],
        ["Security", "mailto:security@trackdub.com"],
        ["Privacy policy", "/privacy"],
        ["Legal", "mailto:legal@trackdub.com"],
      ],
    ],
  ];
  return (
    <footer className="bg-background">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <a
              href="#top"
              className="flex items-center gap-3 font-serif text-3xl leading-none text-foreground"
              aria-label="Trackdub home"
            >
              <img src={trackdubIcon} alt="" className="h-10 w-10 object-contain" />
              <span>
                Trackdub<span className="text-accent">.</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
              A desktop workstation for dubbing video. Local-first. Editable at every stage.
            </p>
            <CompanyAttribution className="mt-3" />
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Early preview ·{" "}
              <a href="/changelog" className="text-foreground hover:text-accent">
                Building in public →
              </a>
            </p>
          </div>
          {cols.map(([h, links]) => (
            <div key={h} className="lg:col-span-2">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {h}
              </div>
              <ul className="mt-4 space-y-2 text-[14px]">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-foreground hover:text-accent">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Rule className="mt-14" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>© 2026 Trackdub</span>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Trackdub on GitHub"
            className="inline-flex items-center gap-2 text-foreground hover:text-accent"
          >
            <Github className="h-4 w-4" aria-hidden="true" /> GitHub
          </a>
        </div>
      </Container>
    </footer>
  );
}

/* ---------------- local-first (privacy + architecture + requirements) ---------------- */
