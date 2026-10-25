import React, { type ReactNode } from "react";
import { projects, type Project } from "./projects";
import { site } from "./site";

type Page = { path: string; title: string; description: string; element: ReactNode };

function Wordmark() {
  return (
    <a className="wordmark" href={site.homeHref} aria-label="Mesalim home">
      <img src="/brand/mesalim-wordmark.svg" alt="" width="2983" height="819" />
    </a>
  );
}

const navigation = [
  ["Trackdub", "/products/trackdub"],
  ["Open source", "/open-source"],
  ["About", "/about"],
] as const;

function Navigation({ path, mobile = false }: { path: string; mobile?: boolean }) {
  return (
    <nav
      className={mobile ? "mobile-links" : "desktop-links"}
      aria-label={mobile ? "Mobile navigation" : "Primary navigation"}
    >
      {navigation.map(([label, href]) => (
        <a
          key={href}
          href={href}
          aria-current={
            path === href || (href === "/open-source" && path.startsWith("/open-source/"))
              ? "page"
              : undefined
          }
        >
          {label}
        </a>
      ))}
      <a href={site.github}>
        GitHub <span aria-hidden="true">↗</span>
      </a>
      <a className="button small" href="/products/trackdub">
        Explore Trackdub <span aria-hidden="true">→</span>
      </a>
    </nav>
  );
}

function Header({ path }: { path: string }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Wordmark />
        <Navigation path={path} />
        <details className="mobile-menu">
          <summary>
            Menu <span aria-hidden="true">+</span>
          </summary>
          <Navigation path={path} mobile />
        </details>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer wrap">
      <div className="footer-top">
        <div>
          <Wordmark />
          <p>Tools for creative work and the systems behind it.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="/products/trackdub">Trackdub</a>
          <a href="/open-source">Open source</a>
          <a href="/about">About & contact</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getUTCFullYear()} Mesalim</span>
        <a href={site.github}>
          Follow our work on GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}

function Button({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <a className={`button${secondary ? " secondary" : ""}`} href={href}>
      {children}
      <span aria-hidden="true">→</span>
    </a>
  );
}

function Breadcrumb({ label, project = false }: { label: string; project?: boolean }) {
  return (
    <nav className="breadcrumb wrap" aria-label="Breadcrumb">
      <a href={site.homeHref}>Mesalim</a>
      <span aria-hidden="true">/</span>
      {project && (
        <>
          <a href="/open-source">Open source</a>
          <span aria-hidden="true">/</span>
        </>
      )}
      <span aria-current="page">{label}</span>
    </nav>
  );
}

function SectionHeading({
  number,
  label,
  title,
  children,
}: {
  number: string;
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <p className="chapter">
        <span>{number}</span> / {label}
      </p>
      <div>
        <h2>{title}</h2>
        {children && <p>{children}</p>}
      </div>
    </div>
  );
}

function ProductImage({ priority = false }: { priority?: boolean }) {
  return (
    <figure className="product-figure">
      <a
        href={`${site.productOrigin}/#walkthrough`}
        className="preview-card"
        aria-label="Explore the Trackdub workstation"
      >
        <div className="preview-top">
          <span>Flagship / Trackdub</span>
          <span className="status">Early preview</span>
        </div>
        <div className="preview-media">
          <img
            src="/images/trackdub-early-build.png"
            alt="Early Trackdub desktop build showing an editable dubbing project and its pipeline controls"
            width="1920"
            height="1050"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
          />
        </div>
        <div className="preview-bottom">
          <div>
            <span className="preview-name">Trackdub</span>
            <p>The dubbing workstation.</p>
          </div>
          <span className="preview-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </a>
      <figcaption>Actual early-build interface. Product is in development.</figcaption>
    </figure>
  );
}

function ProjectCards({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="projects">
      {projects.map((project) => (
        <article className="project" key={project.slug}>
          <div className="project-top">
            <p className="micro">
              {project.number} / {project.category} / MIT
            </p>
            <span className="project-mark" aria-hidden="true">
              [ {project.mark} ]
            </span>
          </div>
          <Heading>{project.name}</Heading>
          <p>{project.summary}</p>
          <a className="text-link" href={`/open-source/${project.slug}`}>
            Explore {project.name}
            <span aria-hidden="true">→</span>
          </a>
        </article>
      ))}
    </div>
  );
}

function Home() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <h1>
            Tools for creators and developers<span className="period">.</span>
          </h1>
          <p className="lead">
            Mesalim builds tools for creative work and the systems behind it. Trackdub is our
            flagship dubbing workstation. Our open source projects support inference, developer
            workflows, and agent memory.
          </p>
          <div className="actions">
            <Button href="/products/trackdub">Explore Trackdub</Button>
            <Button href="/open-source" secondary>
              Browse open source
            </Button>
          </div>
        </div>
        <ProductImage priority />
      </section>
      <nav className="portfolio-index wrap" aria-label="Portfolio">
        <a href="/products/trackdub">
          Trackdub <span>Flagship →</span>
        </a>
        {projects.map((project) => (
          <a href={`/open-source/${project.slug}`} key={project.slug}>
            {project.name}
            <span>{project.category} →</span>
          </a>
        ))}
      </nav>
      <section className="section wrap" id="pipeline">
        <SectionHeading number="01" label="Flagship" title="Make your videos multilingual.">
          An editable dubbing workflow, from transcript to final mix.
        </SectionHeading>
        <div className="feature-content">
          <p>
            Translate, voice, and mix video in a desktop workstation. Inspect each stage, adjust the
            details, and keep the project editable as the work takes shape.
          </p>
          <div className="feature-links">
            <a className="text-link" href={`${site.productOrigin}/#pipeline`}>
              Explore the workflow <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href={`${site.productOrigin}/pricing`}>
              See Trackdub pricing <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href={`${site.productOrigin}/#waitlist`} id="waitlist">
              Join the launch list <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <SectionHeading number="02" label="Open source" title="Open the toolbox.">
          Practical tools for the work around the product, with public source and documentation.
        </SectionHeading>
        <ProjectCards />
      </section>
      <section className="principles">
        <div className="section wrap">
          <SectionHeading number="03" label="How we build" title="Keep the work in your hands." />
          <div className="principle-grid">
            <div>
              <p className="micro">01 / Inspectable work</p>
              <h3>See what happens.</h3>
              <p>
                Make the stages visible so people can understand a result and decide what needs
                attention.
              </p>
            </div>
            <div>
              <p className="micro">02 / Editable systems</p>
              <h3>Keep room to adjust.</h3>
              <p>
                Support focused changes, clear project state, and a workflow that can continue after
                the first output.
              </p>
            </div>
            <div>
              <p className="micro">03 / Practical tools</p>
              <h3>Share useful pieces.</h3>
              <p>
                Give tools a clear job, honest documentation, and source where the project is open.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Trackdub() {
  return (
    <>
      <Breadcrumb label="Trackdub" />
      <section className="hero product-hero wrap">
        <div>
          <p className="eyebrow">Early preview</p>
          <h1>
            Make your videos multilingual<span className="period">.</span>
          </h1>
          <p className="lead">
            Trackdub is a desktop workstation for translating, voicing, and mixing video, with an
            editable workflow from transcript to final mix.
          </p>
          <div className="actions">
            <Button href={`${site.productOrigin}/#pipeline`}>Explore Trackdub</Button>
            <Button href={`${site.productOrigin}/#waitlist`} secondary>
              Join launch list
            </Button>
          </div>
          <p className="product-attribution">A Mesalim product.</p>
        </div>
        <ProductImage priority />
      </section>
      <section className="section wrap">
        <SectionHeading number="01" label="The workstation" title="Shape the dub at every stage.">
          Trackdub brings the creative decisions into one project, with the full workflow and
          current availability on its product site.
        </SectionHeading>
        <div className="benefits">
          <article>
            <p className="micro">Transcript & translation</p>
            <h3>Get the words right.</h3>
            <p>Review the transcript and translation before they become the final voice track.</p>
          </article>
          <article>
            <p className="micro">Speakers & voices</p>
            <h3>Give each line attention.</h3>
            <p>Work with speaker assignments and voice choices as part of the editable project.</p>
          </article>
          <article>
            <p className="micro">Audio & export</p>
            <h3>Finish the mix.</h3>
            <p>Bring the dialogue and audio work together, then export the result.</p>
          </article>
        </div>
      </section>
      <section className="contact-strip">
        <div className="wrap contact-inner">
          <div>
            <h2>Step into the workstation.</h2>
            <p>See the workflow, current plans, documentation, and launch updates.</p>
          </div>
          <div className="feature-links">
            <a className="text-link" href={`${site.productOrigin}/#walkthrough`}>
              View the walkthrough <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href={`${site.productOrigin}/pricing`}>
              Pricing <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href={`${site.productOrigin}/docs`}>
              Product documentation <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function OpenSource() {
  return (
    <>
      <Breadcrumb label="Open source" />
      <section className="page-title wrap">
        <h1>
          Open the toolbox<span className="period">.</span>
        </h1>
        <p className="lead">
          Inference, shell tooling, and agent memory, built in the open. Each project keeps its own
          source, documentation, and community.
        </p>
      </section>
      <section className="section wrap directory">
        <ProjectCards headingLevel={2} />
      </section>
      <section className="section wrap">
        <SectionHeading number="01" label="Contribution" title="Start with the source.">
          Read the current documentation, review project scope, and join the conversation in the
          repository.
        </SectionHeading>
        <div className="source-directory">
          {projects.map((project) => (
            <a key={project.slug} href={project.source}>
              <span>{project.name}</span>
              <span>
                Source & contribution guidance <span aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
        <p className="governance-note">
          These projects are part of Mesalim’s open source portfolio. Their existing repository
          governance, MIT licenses, and contributor rights remain with the respective projects.
        </p>
      </section>
    </>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <>
      <Breadcrumb label={project.name} project />
      <section className="page-title wrap">
        <p className="eyebrow">
          {project.number} / {project.name} / {project.category}
        </p>
        <h1>{project.headline}</h1>
        <p className="lead">{project.summary}</p>
        <div className="badges">
          <span>Open source</span>
          <a
            href={`${project.source}/blob/${project.slug === "numan" ? "master" : "main"}/LICENSE`}
          >
            MIT license <span aria-hidden="true">↗</span>
          </a>
          <span>{project.status}</span>
        </div>
        <div className="actions">
          <Button href={project.source}>View {project.name} source</Button>
          <Button href={project.secondary} secondary>
            {project.secondaryLabel}
          </Button>
        </div>
      </section>
      <dl className="project-meta wrap">
        <div>
          <dt>For</dt>
          <dd>{project.audience}</dd>
        </div>
        <div>
          <dt>Interface</dt>
          <dd>{project.interface}</dd>
        </div>
        <div>
          <dt>Project</dt>
          <dd>{project.name}</dd>
        </div>
      </dl>
      <section className="section detail-grid wrap">
        <div>
          <h2>
            {project.slug === "linml"
              ? "Know what the runtime is doing."
              : project.slug === "numan"
                ? "Put your shell tools in order."
                : "Bring useful context forward."}
          </h2>
          <p>{project.introduction}</p>
          <ul className="plain-list">
            {project.capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
          <aside className="limits" aria-label={`${project.name} current limitations`}>
            <h3>Current boundaries</h3>
            <p>{project.limitations}</p>
          </aside>
        </div>
        <figure className="diagram">
          <figcaption>Conceptual capability map</figcaption>
          <ol>
            {project.diagram.map((step, index) => (
              <li key={step}>
                <span>{step}</span>
                <span aria-hidden="true">0{index + 1}</span>
              </li>
            ))}
          </ol>
          <div className="diagram-tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </figure>
      </section>
      <section className="contact-strip">
        <div className="wrap contact-inner">
          <div>
            <h2>Follow the project.</h2>
            <p>
              Use the repository for current support, installation, releases, and contribution
              guidance.
            </p>
          </div>
          <Button href={project.docs}>Read the documentation</Button>
        </div>
      </section>
    </>
  );
}

function About() {
  return (
    <>
      <Breadcrumb label="About" />
      <section className="page-title about-title wrap">
        <h1>
          Meet Mesalim<span className="period">.</span>
        </h1>
        <p className="lead">
          We build tools for creative work and the systems that make it possible. Trackdub leads the
          product portfolio, alongside open source projects for inference, shell tooling, and agent
          memory.
        </p>
      </section>
      <section className="section wrap">
        <SectionHeading number="01" label="Our work" title="Find the right tool.">
          Each product has a clear job, its own documentation, and an identity that fits the work.
        </SectionHeading>
        <div className="source-directory">
          <a href="/products/trackdub">
            <span>Trackdub</span>
            <span>Flagship dubbing workstation →</span>
          </a>
          {projects.map((project) => (
            <a href={`/open-source/${project.slug}`} key={project.slug}>
              <span>{project.name}</span>
              <span>{project.category} / Open source →</span>
            </a>
          ))}
        </div>
      </section>
      <section className="contact-strip" id="contact">
        <div className="wrap contact-inner">
          <div>
            <h2>Get in touch.</h2>
            <p>
              Find project discussions and source on GitHub. Trackdub support stays with the
              product.
            </p>
          </div>
          <div className="feature-links">
            <a className="text-link" href={site.github}>
              Mesalim on GitHub <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="mailto:hello@trackdub.com">
              Trackdub product support <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Privacy() {
  return (
    <>
      <Breadcrumb label="Privacy" />
      <section className="page-title wrap">
        <h1>
          Understand this website<span className="period">.</span>
        </h1>
        <p className="lead">
          How the Mesalim company website handles information, separate from Trackdub’s product and
          launch-list services.
        </p>
      </section>
      <article className="policy wrap">
        <section>
          <h2>Company website</h2>
          <p>
            This site presents Mesalim’s products and open source portfolio. It does not provide an
            account, signup form, contact form, advertising, or added analytics tracking.
          </p>
        </section>
        <section>
          <h2>Hosting and request information</h2>
          <p>
            Our hosting provider may process request information, including IP address, time,
            requested URL, and browser information, to deliver the website, diagnose failures, and
            help protect the service. Website fonts and images are served with the site.
          </p>
        </section>
        <section>
          <h2>Links to other services</h2>
          <p>
            Trackdub, GitHub, the Numan registry, and npm are separate destinations. Their own
            privacy policies and service terms apply when you visit them. Joining the Trackdub
            launch list happens on the Trackdub website.
          </p>
          <a className="text-link" href={`${site.productOrigin}/privacy`}>
            Trackdub product privacy <span aria-hidden="true">→</span>
          </a>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            For website privacy questions, use the existing shared legal contact at{" "}
            <a href="mailto:legal@trackdub.com">legal@trackdub.com</a>. Include “Mesalim website” so
            the scope is clear.
          </p>
        </section>
      </article>
    </>
  );
}

function NotFound() {
  return (
    <section className="page-title not-found wrap">
      <p className="eyebrow">404 / Page not found</p>
      <h1>
        Find your way back<span className="period">.</span>
      </h1>
      <p className="lead">
        This page is unavailable. Explore the company, find a project, or return to Trackdub.
      </p>
      <div className="actions">
        <Button href={site.homeHref}>Mesalim home</Button>
        <Button href="/open-source" secondary>
          Open source
        </Button>
      </div>
    </section>
  );
}

// This module is rendered at build time and does not participate in React Fast Refresh.
// eslint-disable-next-line react-refresh/only-export-components
export const pages: Page[] = [
  {
    path: "/",
    title: "Mesalim · Tools for creators and developers",
    description: site.description,
    element: <Home />,
  },
  {
    path: "/products/trackdub",
    title: "Trackdub · A Mesalim product",
    description:
      "Meet Trackdub, Mesalim’s flagship desktop dubbing workstation for translating, voicing, and mixing video through an editable workflow.",
    element: <Trackdub />,
  },
  {
    path: "/open-source",
    title: "Open source · Mesalim",
    description:
      "Explore LinML, Numan, and lucid-mem: open source tools for Linux inference, Nushell packages, and Git-backed agent memory.",
    element: <OpenSource />,
  },
  ...projects.map((project) => ({
    path: `/open-source/${project.slug}`,
    title: `${project.name} · Mesalim open source`,
    description: project.summary,
    element: <ProjectDetail project={project} />,
  })),
  {
    path: "/about",
    title: "About Mesalim",
    description:
      "Meet Mesalim, the company behind Trackdub, with an open source portfolio spanning inference, shell tooling, and agent memory.",
    element: <About />,
  },
  {
    path: "/privacy",
    title: "Website privacy · Mesalim",
    description:
      "Information about hosting, request data, external links, and privacy contacts for the Mesalim company website.",
    element: <Privacy />,
  },
  {
    path: "/404",
    title: "Page not found · Mesalim",
    description: "Find your way back to Mesalim’s products and open source projects.",
    element: <NotFound />,
  },
];

export function CompanyDocument({
  page,
  preview,
}: {
  page: (typeof pages)[number];
  preview: boolean;
}) {
  const canonical = `${site.origin}${page.path === "/" ? "/" : page.path}`;
  const noindex = preview || page.path === "/404";
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.origin,
    description: site.description,
    sameAs: [site.github],
    brand: { "@type": "Brand", name: "Trackdub", url: site.productOrigin },
  };
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="theme-color" content="#f6eddd" />
        <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
        <link rel="canonical" href={canonical} />
        <link rel="icon" href="/brand/mesalim-favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/brand/mesalim-touch-icon.png" />
        <link rel="stylesheet" href="/company.css" />
        <link
          rel="preload"
          href="/fonts/instrument-serif-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/ibm-plex-sans-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={site.name} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${site.origin}/og.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Mesalim — tools for creators and developers" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.title} />
        <meta name="twitter:description" content={page.description} />
        <meta name="twitter:image" content={`${site.origin}/og.png`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
          }}
        />
        <script src="/company.js" defer />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header path={page.path} />
        <main id="main-content" tabIndex={-1}>
          {page.element}
        </main>
        <Footer />
      </body>
    </html>
  );
}
