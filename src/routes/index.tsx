import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { FAQ } from "@/components/home/faq";
import { FAQ_ITEMS } from "@/components/home/faq-items";
import { SectionRail } from "@/components/home/section-rail";
import { Masthead } from "@/components/home/masthead";
import { Lead } from "@/components/home/lead";
import { ResumableJob } from "@/components/home/resumable-job";
import { ProductPlate } from "@/components/home/product-plate";
import { TrustStrip } from "@/components/home/trust-strip";
import { PipelineFeature } from "@/components/home/pipeline-feature";
import { Walkthrough } from "@/components/home/walkthrough";
import { StageChapters } from "@/components/home/stage-chapters";
import { Control } from "@/components/home/control";
import { Performance } from "@/components/home/performance";
import { WhatYouGet } from "@/components/home/what-you-get";
import { ComparedTo } from "@/components/home/compared-to";
import { Pricing } from "@/components/home/pricing";
import { Endnote } from "@/components/home/endnote";
import { Colophon } from "@/components/home/colophon";
import { LocalFirst } from "@/components/home/local-first";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trackdub · A desktop workstation for dubbing video" },
      {
        name: "description",
        content:
          "Trackdub is a local-first desktop workstation for dubbing video into other languages. Editable stages, deterministic runs, your media stays on your machine.",
      },
      { property: "og:title", content: "Trackdub · A desktop workstation for dubbing video" },
      {
        property: "og:description",
        content:
          "Local-first, stage-by-stage dubbing. Editable script, per-line voice, alignment, mix: all inspectable.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Trackdub",
          url: "https://trackdub.com",
          description: "Local-first Windows desktop workstation for AI video dubbing.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.a },
          })),
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-accent/20 selection:text-ink">
      <Masthead />
      <SectionRail />
      <main>
        <Lead />
        <PipelineFeature />
        <ProductPlate />
        <TrustStrip />
        <Walkthrough />
        <ResumableJob />
        <StageChapters />
        <Control />
        <Performance />
        <LocalFirst />
        <WhatYouGet />
        <ComparedTo />
        <Pricing />
        <FAQ />
        <Endnote />
      </main>
      <Colophon />
    </div>
  );
}

/* ---------------- shared bits ---------------- */
