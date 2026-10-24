import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

const PUBLISHED = "2026-07-01";
const MODIFIED = "2026-07-27";
const URL = "https://trackdub.com/guides/ai-dubbing-guide";
const OG_IMAGE = "https://trackdub.com/og-ai-dubbing-guide.png";

const TOC: { id: string; label: string }[] = [
  { id: "what-is-dubbing-ai", label: "What is dubbing AI?" },
  { id: "six-stages", label: "The six stages" },
  { id: "cloud-vs-local", label: "Cloud vs local-first" },
  { id: "buyer-criteria", label: "What to look for" },
  { id: "limitations", label: "Honest limitations" },
  { id: "when-to-use-what", label: "When to use what" },
  { id: "trackdub-workflow", label: "How Trackdub runs it" },
  { id: "checklist", label: "Workflow checklist" },
  { id: "faq", label: "FAQ" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is dubbing AI?",
    a: "Dubbing AI is a chain of models that transcribes source speech, translates it, assigns speakers, generates target-language voices, and mixes them back with the original music and effects. It's a pipeline, not a single model.",
  },
  {
    q: "What is the best AI dubbing software in 2026?",
    a: "The best AI dubbing software depends on the work. Cloud services are fine for one-off social clips. For serial work, NDA footage, or client backlogs, a local-first AI dubbing tool like Trackdub gives you stage-level control, resumable jobs, and no per-minute billing.",
  },
  {
    q: "Can I dub a video with AI locally on my own PC?",
    a: "Yes. A modern consumer GPU with DirectML or TensorRT RTX runs the full AI video dubbing stack — ASR, translation, TTS, and mix — faster than real-time. CPU fallback keeps a laptop usable for shorter jobs.",
  },
  {
    q: "Is AI voice dubbing accurate enough for professional work?",
    a: "Modern AI voice dubbing handles tone, pacing, and speaker identity well, but no model is perfect on names, jargon, or overlapping speech. Professional results come from tools that let you edit the transcript, translation, speaker map, and individual TTS takes without rerunning the whole pipeline.",
  },
  {
    q: "Is there a free AI dubbing tool?",
    a: "Most cloud AI dubbing services offer a limited free tier with watermarks and per-minute caps. Trackdub ships a free desktop tier with a five-minute project limit and a watermark, and a one-time Pro license at $149 for unlimited local use with no watermark.",
  },
  {
    q: "How much does AI dubbing cost?",
    a: "Cloud tools typically bill per minute of output, often forever. Traditional studio dubbing can run tens of dollars per finished minute. Trackdub's Free tier is watermarked and capped at five minutes; Pro is a $149 one-time license with unlimited local runs and no per-minute fee.",
  },
  {
    q: "Does AI dubbing include lip sync?",
    a: "Some cloud products regenerate mouth movements frame by frame. Trackdub focuses on audio dubbing: transcription, translation, speaker-aware TTS, timing, and mix. Lip sync is on the roadmap as an inspectable stage, not a black-box default. If on-camera mouth match is the primary deliverable today, evaluate a lip-sync-first cloud tool alongside a local audio workstation.",
  },
  {
    q: "AI dubbing vs subtitles: which should I use?",
    a: "Subtitles are cheaper and preserve the original performance; they fail when viewers can't or won't read. AI dubbing reaches broader audiences and keeps eyes on the picture, but it needs editable stages for names, tone, and timing. Many teams ship both: a dubbed mix for immersion and captions for accessibility.",
  },
  {
    q: "How many languages does AI video dubbing support?",
    a: "Language coverage depends on the underlying ASR, MT, and TTS models. Trackdub ships with dozens of source and target languages at launch and adds more as upstream models improve.",
  },
  {
    q: "Does local AI dubbing keep my footage private?",
    a: "Yes — that's the point of a local-first workflow. Media, transcripts, and voice prints stay on your machine. Cloud stages are opt-in per project, per stage, and never implicit.",
  },
];

const CHECKLIST_URL = "/downloads/trackdub-local-first-dubbing-checklist.pdf";
const CHECKLIST_ABSOLUTE_URL =
  "https://trackdub.com/downloads/trackdub-local-first-dubbing-checklist.pdf";
const CHECKLIST_ANCHOR_URL = `${URL}#checklist`;

const TITLE = "Dubbing AI in 2026: A Practical Guide to Local-First AI Video Dubbing";
const DESCRIPTION =
  "How dubbing AI works stage by stage in 2026 — ASR, translation, diarization, TTS, and mix — plus how local AI video dubbing software compares to cloud services.";

export const Route = createFileRoute("/guides/ai-dubbing-guide")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      {
        property: "og:description",
        content:
          "A stage-by-stage guide to dubbing AI — ASR, translation, diarization, TTS, mix — and why local AI dubbing software beats black-box cloud services for serious work.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Dubbing AI in 2026 — a practical guide to local-first AI video dubbing",
      },
      { property: "article:published_time", content: PUBLISHED },
      { property: "article:modified_time", content: MODIFIED },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      {
        name: "twitter:description",
        content:
          "Dubbing AI stage by stage — and why local AI video dubbing software beats black-box cloud pipelines.",
      },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          image: [OG_IMAGE],
          datePublished: PUBLISHED,
          dateModified: MODIFIED,
          author: { "@type": "Organization", name: "Trackdub", url: "https://trackdub.com/" },
          publisher: {
            "@type": "Organization",
            name: "Trackdub",
            url: "https://trackdub.com/",
            logo: {
              "@type": "ImageObject",
              url: "https://trackdub.com/icon-512.png",
            },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": URL },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trackdub", item: "https://trackdub.com/" },
            {
              "@type": "ListItem",
              position: 2,
              name: "Guides",
              item: "https://trackdub.com/guides",
            },
            { "@type": "ListItem", position: 3, name: "Dubbing AI", item: URL },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Trackdub",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Windows, macOS, Linux",
          description: "Local-first desktop workstation for AI video dubbing.",
          url: "https://trackdub.com/",
          offers: [
            {
              "@type": "Offer",
              name: "Free",
              price: "0",
              priceCurrency: "USD",
              description: "Watermarked exports, 5-minute project cap",
            },
            {
              "@type": "Offer",
              name: "Pro",
              price: "149",
              priceCurrency: "USD",
              description: "One-time license, unlimited local runs, no watermark",
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DigitalDocument",
          "@id": CHECKLIST_ANCHOR_URL,
          name: "Local-First Dubbing Workflow Checklist",
          headline: "Local-First Dubbing Workflow Checklist",
          description:
            "A printable, stage-by-stage checklist for shipping AI-dubbed video without giving up control — ingest, ASR, translation, diarization, TTS, mix, reliability, and privacy.",
          url: CHECKLIST_ANCHOR_URL,
          contentUrl: CHECKLIST_ABSOLUTE_URL,
          encodingFormat: "application/pdf",
          fileFormat: "application/pdf",
          numberOfPages: 2,
          inLanguage: "en",
          isAccessibleForFree: true,
          datePublished: PUBLISHED,
          dateModified: MODIFIED,
          author: { "@type": "Organization", name: "Trackdub" },
          publisher: {
            "@type": "Organization",
            name: "Trackdub",
            url: "https://trackdub.com/",
          },
          license: "https://creativecommons.org/licenses/by/4.0/",
          isPartOf: { "@type": "Article", "@id": URL },
          potentialAction: {
            "@type": "DownloadAction",
            name: "Download the Local-First Dubbing Workflow Checklist",
            target: {
              "@type": "EntryPoint",
              urlTemplate: CHECKLIST_ABSOLUTE_URL,
              contentType: "application/pdf",
            },
          },
        }),
      },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <nav className="mb-10 text-sm" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground">
                Trackdub
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link to="/guides" className="hover:text-foreground">
                Guides
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground">Dubbing AI</li>
          </ol>
        </nav>

        <article className="space-y-10 leading-relaxed">
          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Guide · Dubbing AI
            </p>
            <h1 className="font-serif text-4xl md:text-5xl leading-[1.05]">
              Dubbing AI in 2026: a practical guide to local-first AI video dubbing
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything that happens between a source clip and a finished dub — how modern AI video
              dubbing works stage by stage, what breaks, and why serious teams are moving AI dubbing
              software off cloud services and onto local workstations.
            </p>
            <p className="text-xs text-muted-foreground">
              Published {PUBLISHED} · Updated {MODIFIED} · 12 min read
            </p>
          </header>

          <nav
            aria-label="On this page"
            className="rounded-md border border-border bg-muted/20 p-5 md:p-6"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              On this page
            </p>
            <ol className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              {TOC.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-foreground hover:text-accent underline-offset-4 hover:underline"
                  >
                    <span className="mr-2 font-mono text-[11px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <section id="what-is-dubbing-ai" className="scroll-mt-24 space-y-3">
            <h2 className="font-serif text-2xl">What is dubbing AI?</h2>
            <p>
              Dubbing AI is a chain of models, not a single one. A source video is transcribed,
              translated, cut into speaker turns, revoiced with synthesized speech, and mixed back
              against the original music and effects. AI video dubbing tools stitch these stages
              into one pipeline; the quality of the finished dub is the quality of the weakest link.
              Every stage has its own failure modes — mistranscribed names, off-tone translations,
              the wrong speaker on a line, a TTS take that overruns the shot.
            </p>
            <p>
              Searchers call this stack many names: AI dubbing, AI video dubbing, AI voice dubbing,
              or simply “dub a video with AI.” Under every label, the same six-stage pipeline does
              the work. What changes between tools is how much of that pipeline you can inspect,
              edit, and re-run without starting over.
            </p>
          </section>

          <section id="six-stages" className="scroll-mt-24 space-y-6">
            <h2 className="font-serif text-2xl">How AI video dubbing works: the six stages</h2>
            <p>
              Treat each stage as a contract with clear inputs and outputs. When something sounds
              wrong in the final mix, the fix almost always lives in one of these six places — not
              in “regenerate everything.”
            </p>

            <div className="space-y-5">
              <Stage
                n="01"
                title="Ingest"
                body="Demux the source, normalize sample rate, keep the original picture untouched. Good ingest preserves stems and timing metadata so later stages don't invent sync problems. Failures here look like dropped channels, wrong frame rates, or exports that drift from the timeline."
              />
              <Stage
                n="02"
                title="AI transcription (ASR)"
                body="Turn source speech into timestamped text. This is where names, jargon, accents, and overlapping speech get mangled. Catch errors here: a wrong proper noun will poison translation and TTS. Editable transcripts with per-line timing beat opaque “confidence scores” you can't act on."
              />
              <Stage
                n="03"
                title="AI translation"
                body="Convert the transcript into the target language with context — idioms, register, on-screen text, brand glossary. Word-for-word MT produces stiff dubs. The tools that win let you lock terminology, rewrite a line for length, and regenerate only that line's voice."
              />
              <Stage
                n="04"
                title="Diarization & speaker assignment"
                body="Group turns by speaker so the right voice reads the right lines. Panels, interviews, and overlapping dialogue are the hard cases. If speaker maps aren't editable, one mis-assign forces a full re-dub. Local workstations should show the map and let you split, merge, or reassign turns."
              />
              <Stage
                n="05"
                title="AI voice dubbing (TTS)"
                body="Synthesize each line in a voice that fits the speaker and the timing budget of the shot. Prosody, pace, and identity matter more than raw clarity. Professional workflows regenerate a single take without invalidating neighboring lines or the mix."
              />
              <Stage
                n="06"
                title="Mix & preview"
                body="Duck the original dialogue, keep music and effects, and render a preview you can actually judge. Stem-aware mix is the difference between a demo and a deliverable. Export muxed video, stems, or captions from the same project state."
              />
            </div>
          </section>

          <section id="cloud-vs-local" className="scroll-mt-24 space-y-3">
            <h2 className="font-serif text-2xl">
              Cloud AI dubbing software vs. local-first workstations
            </h2>
            <p>
              Cloud AI dubbing services are convenient for one-off clips. For real work — a series,
              a client backlog, footage under NDA — the tradeoffs against a local AI dubbing tool
              add up quickly.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border">
                <thead>
                  <tr className="bg-muted/40 text-left">
                    <th className="p-3 border-b border-border">Concern</th>
                    <th className="p-3 border-b border-border">Cloud AI dubbing service</th>
                    <th className="p-3 border-b border-border">Local AI dubbing workstation</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  <tr>
                    <td className="p-3 border-b border-border">Control</td>
                    <td className="p-3 border-b border-border">One button, opaque pipeline</td>
                    <td className="p-3 border-b border-border">
                      Every stage inspectable and re-runnable
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-border">Fixing one line</td>
                    <td className="p-3 border-b border-border">Usually re-runs everything</td>
                    <td className="p-3 border-b border-border">
                      Regenerate that line, keep the rest
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-border">Cost model</td>
                    <td className="p-3 border-b border-border">Per-minute, forever</td>
                    <td className="p-3 border-b border-border">
                      One-time license, unlimited local runs
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-border">Data</td>
                    <td className="p-3 border-b border-border">Media uploaded to a third party</td>
                    <td className="p-3 border-b border-border">
                      Stays on your machine unless you opt in
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3">Reliability</td>
                    <td className="p-3">Fails whole jobs on transient errors</td>
                    <td className="p-3">Resumable jobs, typed failure classes</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Modern consumer GPUs run the entire dubbing AI stack fast enough for production.
              DirectML and TensorRT RTX push ASR and AI voice dubbing well past real-time on a
              mid-range card; CPU fallback keeps the pipeline usable on laptops. Once inference
              lives on your hardware, sovereignty, cost, and iteration speed change at once.
            </p>
          </section>

          <section id="buyer-criteria" className="scroll-mt-24 space-y-3">
            <h2 className="font-serif text-2xl">What to look for in an AI dubbing tool</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Every stage is editable, not just the final output.</li>
              <li>Fixing one line doesn't invalidate the rest of the project.</li>
              <li>Jobs are resumable after crashes, OOMs, or cancellations.</li>
              <li>Errors name the stage and the cause, not a generic “failed”.</li>
              <li>
                Local acceleration is real — DirectML, TensorRT RTX, or equivalent — with an honest
                CPU fallback.
              </li>
              <li>Stems (vocals, music, effects) can be separated and re-mixed.</li>
              <li>
                Pricing matches the work: free evaluation without a card, then a clear path to
                unlimited local use. Trackdub's Free tier is watermarked and capped at five minutes;
                Pro is $149 one-time with no per-minute billing.
              </li>
            </ul>
          </section>

          <section id="limitations" className="scroll-mt-24 space-y-3">
            <h2 className="font-serif text-2xl">Honest limitations</h2>
            <p>
              No AI dubbing tool is magic. Overlapping speech, heavy accents, on-screen text that
              contradicts the spoken line, and music-bed bleed still need human judgment. Lip-sync
              regeneration is a separate problem from audio dubbing: some cloud products lead there
              today; Trackdub prioritizes inspectable audio stages and treats lip sync as a future
              pipeline stage, not a hidden rewrite of your picture.
            </p>
            <p>
              If your deliverable is a talking-head with perfect mouth match in twenty languages by
              tomorrow morning, a lip-sync-first cloud stack may be the right first pass. If your
              deliverable is a season under NDA with glossary control and per-line fixes,
              local-first audio dubbing is the durable workstation.
            </p>
          </section>

          <section id="when-to-use-what" className="scroll-mt-24 space-y-3">
            <h2 className="font-serif text-2xl">When to use what</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Cloud end-to-end dubbing</strong> (tools in the Rask / HeyGen / similar
                lane): fast one-offs, social clips, demos where upload risk is acceptable.
              </li>
              <li>
                <strong>Voice-first APIs</strong> (ElevenLabs and peers): custom pipelines when you
                already own ASR/translation and only need TTS.
              </li>
              <li>
                <strong>Editor suites with light dubbing</strong> (Descript-style): short form
                inside an existing edit bay, not a localization factory.
              </li>
              <li>
                <strong>Local-first workstations</strong> (Trackdub): serial volume, privacy, stage
                edits, resumable jobs, and predictable cost after a one-time license.
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Categories blur. Evaluate on your own footage, not vendor demos — especially names,
              multi-speaker turns, and music beds.
            </p>
          </section>

          <section id="trackdub-workflow" className="scroll-mt-24 space-y-3">
            <h2 className="font-serif text-2xl">How to dub a video with AI in Trackdub</h2>
            <p>
              Trackdub is a desktop workstation built around this philosophy: dubbing AI as a
              pipeline you drive, not a service you submit to. Drop in a clip, pick a target
              language, and Trackdub runs ingest, ASR, translation, diarization, AI voice dubbing,
              and mix as separate, inspectable stages. Fix one line, reassign a speaker, swap a
              voice — the rest of the project stays intact. Media stays local unless you explicitly
              opt a stage into a cloud model.
            </p>
            <p>
              <Link to="/" className="underline underline-offset-4">
                See the full workflow on the Trackdub homepage →
              </Link>
              {" · "}
              <Link to="/pricing" className="underline underline-offset-4">
                Pricing
              </Link>
              {" · "}
              <Link to="/docs" className="underline underline-offset-4">
                Docs
              </Link>
            </p>
          </section>

          <section
            id="checklist"
            className="scroll-mt-24 space-y-4 rounded-md border border-border bg-muted/30 p-6 md:p-8"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Free download · PDF · 2 pages
            </p>
            <h2 className="font-serif text-2xl">Local-First Dubbing Workflow Checklist</h2>
            <p>
              A printable, stage-by-stage checklist for shipping AI-dubbed video without giving up
              control. Eight sections covering ingest, ASR, translation, diarization, TTS, mix,
              reliability, and privacy — every item is a concrete thing to verify before you call a
              pipeline production-ready.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Audit an existing dubbing AI pipeline against a fixed spec.</li>
              <li>Spec a new local AI dubbing workflow from scratch.</li>
              <li>Free to share and adapt with attribution.</li>
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={CHECKLIST_URL}
                download
                type="application/pdf"
                aria-label="Download the Local-First Dubbing Workflow Checklist (PDF, 2 pages)"
                className="inline-flex items-center gap-2 rounded-md border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              >
                Download the checklist (PDF)
              </a>
              <a
                href={CHECKLIST_URL}
                target="_blank"
                rel="noopener"
                type="application/pdf"
                aria-label="Preview the checklist PDF in a new tab"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50"
              >
                Preview in browser →
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Linking to this checklist? Point to{" "}
              <code className="text-foreground">
                trackdub.com/guides/ai-dubbing-guide#checklist
              </code>
              .
            </p>
          </section>

          <section className="space-y-4 scroll-mt-24" id="faq">
            <h2 className="font-serif text-2xl">Dubbing AI FAQ</h2>
            <div className="divide-y divide-border border-t border-b border-border">
              {FAQS.map(({ q, a }) => (
                <details key={q} className="group py-4">
                  <summary className="cursor-pointer list-none font-medium flex items-start justify-between gap-4">
                    <span>{q}</span>
                    <span
                      aria-hidden
                      className="text-muted-foreground transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </section>
        </article>
      </div>
    </SiteShell>
  );
}

function Stage({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="border-t border-border pt-4">
      <h3 className="font-serif text-xl text-foreground">
        <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
          {n}
        </span>
        {title}
      </h3>
      <p className="mt-2 text-[15px] text-muted-foreground">{body}</p>
    </div>
  );
}
