import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

const GUIDES = [
  {
    to: "/guides/ai-dubbing-guide" as const,
    title: "Dubbing AI in 2026",
    blurb:
      "How AI video dubbing works stage by stage — ASR, translation, diarization, TTS, and mix — plus when local-first beats cloud services.",
    meta: "Guide · 8 min",
  },
];

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "Guides · Trackdub" },
      {
        name: "description",
        content:
          "Practical guides on AI video dubbing: how the pipeline works, local vs cloud tradeoffs, and what to look for in dubbing software.",
      },
      { property: "og:title", content: "Guides · Trackdub" },
      {
        property: "og:description",
        content: "Practical guides on AI video dubbing and local-first workflows.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://trackdub.com/guides" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://trackdub.com/guides" }],
  }),
  component: GuidesIndex,
});

function GuidesIndex() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <nav className="mb-10 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            ← Back to Trackdub
          </Link>
        </nav>

        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Guides</p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05]">
            How AI video dubbing actually works
          </h1>
          <p className="text-lg text-muted-foreground">
            Stage-by-stage explainers for people evaluating AI dubbing software — not marketing
            blurbs.
          </p>
        </header>

        <ul className="mt-12 divide-y divide-border border-t border-b border-border">
          {GUIDES.map((g) => (
            <li key={g.to} className="py-6">
              <Link to={g.to} className="group block space-y-2 hover:opacity-90">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {g.meta}
                </p>
                <h2 className="font-serif text-2xl text-foreground group-hover:text-accent">
                  {g.title}
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{g.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SiteShell>
  );
}
