import { Container, SectionNumber } from "@/components/home/shared";
import { replayStamp } from "@/components/home/helpers";

type StayItem = { item: string; note: string };
type OptinItem = { item: string; what: string; how: string };
type RetentionItem = { item: string; what: string; retention: string };
type Tier = {
  id: string;
  eyebrow: string;
  name: string;
  tagline: string;
  featured?: boolean;
  stamp?: string;
  rows: [string, string][];
};
type Accelerator = { name: string; requirement: string; speedup: string; caveat: string };

const PIPELINE = ["Ingest", "Transcribe", "Translate", "Diarize", "Voice", "Mix", "Export"];

const STAYS: StayItem[] = [
  { item: "Source media", note: "Never uploaded. Decode, analysis, and export are local." },
  {
    item: "Transcripts & translations",
    note: "Editable local files, plus glossary and speaker maps.",
  },
  { item: "Voice references", note: "Per-project only. Never used to train a shared model." },
  { item: "Generated audio & stems", note: "Written to the output folder you choose." },
  { item: "Project files", note: "SQLite state and manifests, in a folder you control." },
  { item: "Model cache", note: "ONNX models and engine caches. Clearable in Preferences." },
];

const OPTIN: OptinItem[] = [
  {
    item: "Cloud translation",
    what: "Source text for the lines you route to a hosted provider.",
    how: "Off by default · per project, per stage",
  },
  {
    item: "Cloud voice generation",
    what: "Target text and optional speaker reference for hosted TTS.",
    how: "Off by default · per project, per stage",
  },
  {
    item: "Telemetry",
    what: "Anonymous crash reports and usage counters.",
    how: "Disabled on install",
  },
  {
    item: "Update checks",
    what: "App version and OS info only. No media, no project data.",
    how: "On launch · can be disabled",
  },
];

const RETENTION: RetentionItem[] = [
  {
    item: "Project files",
    what: "SQLite project state, manifests, and stage snapshots.",
    retention: "Kept in the project folder you choose. Deleted when you delete the project.",
  },
  {
    item: "Source media",
    what: "Original video/audio, proxies, and extracted stems.",
    retention: "Never uploaded. You choose the folder and can wipe it at any time.",
  },
  {
    item: "Transcripts & translations",
    what: "Editable script documents, glossaries, and speaker mappings.",
    retention: "Stored as local files. No cloud sync unless you configure it.",
  },
  {
    item: "Voice references",
    what: "Short speaker clips used for voice cloning.",
    retention: "Stay on disk. Never used to train a shared model.",
  },
  {
    item: "Generated audio",
    what: "Per-line TTS output, mix stems, and exported deliverables.",
    retention: "Written to your project output folder. You own and control them.",
  },
  {
    item: "Model cache",
    what: "Downloaded ONNX models and compiled engine caches.",
    retention: "Stored in the app data directory. Can be cleared in Preferences.",
  },
];

const TIERS: Tier[] = [
  {
    id: "floor",
    eyebrow: "Trim 01 · CPU-only or cloud-routed",
    name: "Bare minimum",
    tagline: "Slow is fine. Stuck is not.",
    rows: [
      ["OS", "Windows 10 Enterprise LTSC 2021 (build 19044), or Windows 11"],
      ["CPU", "Any 64-bit x64 or ARM64"],
      ["GPU", "None. CPU inference, or route the heavy stages to a cloud provider"],
      ["RAM", "16 GB · 8 GB workable when heavy stages are cloud-routed"],
      ["VRAM", "none needed"],
      ["Storage", "10 GB for app + bundled models"],
    ],
  },
  {
    id: "recommended",
    eyebrow: "Trim 02 · The daily driver",
    name: "Recommended",
    tagline: "Comfortable for 1080p projects.",
    featured: true,
    rows: [
      ["OS", "Windows 11 24H2 (build 26100)"],
      ["CPU", "Modern 8-core x64, or Snapdragon X-class ARM64"],
      ["GPU", "RTX 3060 / 4060 class, or any DirectX 12 GPU via DirectML"],
      ["RAM", "32 GB"],
      ["VRAM", "8 GB"],
      ["Storage", "SSD · 50 GB free for model + engine cache"],
    ],
  },
  {
    id: "premium",
    eyebrow: "Trim 03 · The studio rig",
    name: "Premium",
    tagline: "4K, long-form, many speakers, no waiting.",
    stamp: "Overkill: approved ✓",
    rows: [
      ["OS", "Windows 11 24H2 (build 26100)"],
      ["CPU", "12 cores or better"],
      ["GPU", "RTX 4080 / 5080 class, TensorRT RTX lane"],
      ["RAM", "64 GB"],
      ["VRAM", "16 GB+"],
      ["Storage", "NVMe SSD · 100 GB free"],
    ],
  },
];

const OTHER_PLATFORMS: [string, string][] = [
  [
    "macOS",
    "macOS 14 Sonoma or later. Apple Silicon recommended; the CoreML lane uses the Neural Engine; Intel Macs run the CPU lane.",
  ],
  [
    "Linux",
    "Ubuntu 22.04+ / Debian 12+ or equivalent glibc distro, x64 or arm64. NVIDIA CUDA for acceleration; CPU otherwise.",
  ],
];

const ACCELERATORS: Accelerator[] = [
  {
    name: "TensorRT RTX",
    requirement: "Windows or Linux · NVIDIA RTX 30 / 40 / 50 series",
    speedup: "Fastest on supported hardware",
    caveat:
      "Requires a compatible model, driver, and installed provider bundle. First run can compile an engine cache.",
  },
  {
    name: "CUDA",
    requirement: "Linux or advanced Windows setup · NVIDIA GPU",
    speedup: "Fast general NVIDIA lane",
    caveat: "Used when the matching native ONNX Runtime and CUDA dependencies are available.",
  },
  {
    name: "CoreML",
    requirement: "macOS · Apple Silicon",
    speedup: "Apple Neural Engine + GPU",
    caveat: "Model compatibility determines whether a stage stays on CoreML or falls back to CPU.",
  },
  {
    name: "MIGraphX",
    requirement: "Windows 11 24H2+ · supported AMD GPU",
    speedup: "AMD catalog acceleration",
    caveat:
      "Installed through the Windows ML provider catalog; availability is model and device dependent.",
  },
  {
    name: "OpenVINO",
    requirement: "Windows 11 24H2+ · supported Intel CPU, GPU, or NPU",
    speedup: "Intel catalog acceleration",
    caveat:
      "Installed through the Windows ML provider catalog and used only for compatible stages.",
  },
  {
    name: "QNN",
    requirement: "Windows ARM64 · compatible Snapdragon device",
    speedup: "Qualcomm NPU/GPU acceleration",
    caveat:
      "Catalog availability and model support determine whether a stage can use the QNN lane.",
  },
  {
    name: "DirectML",
    requirement: "Windows · any DirectX 12 GPU · 4 GB+ VRAM",
    speedup: "Broadest Windows GPU coverage",
    caveat:
      "Legacy-compatible fallback for Intel, AMD, and NVIDIA hardware; model support varies by stage.",
  },
  {
    name: "CPU fallback",
    requirement: "Windows, macOS, or Linux · x64 or ARM64",
    speedup: "Portable baseline",
    caveat: "Always available. No accelerator is required to complete a project.",
  },
];

function DataPlaneMap() {
  return (
    <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-12">
      {/* inside the machine */}
      <div className="relative border-2 border-foreground bg-background p-6 sm:p-8">
        <span className="absolute -top-[11px] left-6 bg-background px-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground">
          Your machine
        </span>
        <div className="flex flex-wrap items-center gap-y-2 font-mono text-[11px]">
          {PIPELINE.map((s, i) => (
            <span key={s} data-reveal-child className="reveal-child flex items-center">
              {i > 0 && (
                <span className="px-1.5 text-accent" aria-hidden>
                  →
                </span>
              )}
              <span className="border border-border px-2 py-1 uppercase tracking-[0.12em] text-foreground">
                {s}
              </span>
            </span>
          ))}
        </div>
        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Stays on this side of the line
        </div>
        <ul className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {STAYS.map((s) => (
            <li key={s.item} data-reveal-child className="reveal-child border-t border-border pt-3">
              <div className="font-serif text-[17px] text-foreground">{s.item}</div>
              <div className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{s.note}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* across the boundary */}
      <div className="relative border-2 border-dashed border-border p-6 sm:p-8">
        <span className="absolute -top-[11px] left-6 bg-surface px-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Across the line · opt-in only
        </span>
        <ul className="space-y-6">
          {OPTIN.map((o) => (
            <li key={o.item} data-reveal-child className="reveal-child">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[13px] text-accent" aria-hidden>
                  ⇠
                </span>
                <span className="font-serif text-[18px] text-foreground">{o.item}</span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{o.what}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                {o.how}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RequirementsSection() {
  return (
    <div id="requirements" className="mt-16 scroll-mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
          Pick your trim level.
        </h3>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Tbl. 03 &nbsp;·&nbsp; System requirements
        </span>
      </div>
      <div className="mt-8 grid divide-y divide-border border border-border md:grid-cols-3 md:divide-x md:divide-y-0">
        {TIERS.map((t) => (
          <article
            key={t.id}
            data-reveal-child
            className={`reveal-child relative p-6 sm:p-7 ${t.featured ? "bg-background" : ""}`}
          >
            {t.stamp && (
              <div
                aria-hidden
                onClick={replayStamp}
                className="stamp-in absolute -top-4 right-4 hidden cursor-pointer select-none rotate-[5deg] border-[3px] border-double border-accent bg-background px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent sm:block"
                title="Stamp it again"
              >
                {t.stamp}
              </div>
            )}
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              {t.eyebrow}
            </div>
            <div className="mt-2 font-serif text-[26px] leading-tight text-foreground">{t.name}</div>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{t.tagline}</p>
            <dl className="mt-5 space-y-2.5">
              {t.rows.map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[64px_1fr] gap-3 border-t border-border/70 pt-2.5"
                >
                  <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="text-[13px] leading-relaxed text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
      <div className="mt-6 border border-dashed border-border p-5 sm:p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Other platforms · provisional until those builds ship
        </div>
        <dl className="mt-3 grid gap-x-10 gap-y-3 md:grid-cols-2">
          {OTHER_PLATFORMS.map(([name, desc]) => (
            <div key={name} className="grid grid-cols-[64px_1fr] gap-3">
              <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
                {name}
              </dt>
              <dd className="text-[13px] leading-relaxed text-muted-foreground">{desc}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        No accelerator required; every stage has a CPU fallback. HDD works; it just makes you wait.
      </p>
    </div>
  );
}

function FinePrintSection() {
  return (
    <div className="mt-14 border-t border-border">
      <details id="privacy" className="group scroll-mt-24 border-b border-border">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
          <span>Tbl. 02 &nbsp;·&nbsp; What's stored locally, and for how long</span>
          <span
            className="text-[16px] leading-none text-accent transition-transform group-open:rotate-45"
            aria-hidden
          >
            +
          </span>
        </summary>
        <div className="overflow-x-auto pb-8">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="border-b border-border py-3 pr-4 font-normal">Data</th>
                <th className="border-b border-border py-3 pr-4 font-normal">What it is</th>
                <th className="border-b border-border py-3 font-normal">Retention</th>
              </tr>
            </thead>
            <tbody>
              {RETENTION.map((l) => (
                <tr key={l.item} className="hover:bg-background/60">
                  <td className="border-b border-border py-4 pr-4 align-top font-serif text-[17px] text-foreground">
                    {l.item}
                  </td>
                  <td className="border-b border-border py-4 pr-4 align-top text-[14px] leading-relaxed text-muted-foreground">
                    {l.what}
                  </td>
                  <td className="border-b border-border py-4 align-top font-mono text-[12px] text-foreground">
                    {l.retention}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <details className="group border-b border-border">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
          <span>Tbl. 04 &nbsp;·&nbsp; Acceleration lanes, in detail</span>
          <span
            className="text-[16px] leading-none text-accent transition-transform group-open:rotate-45"
            aria-hidden
          >
            +
          </span>
        </summary>
        <div className="grid gap-px bg-border md:grid-cols-2">
          {ACCELERATORS.map((a) => (
            <div key={a.name} className="bg-surface p-5">
              <div className="font-serif text-[20px] text-foreground">{a.name}</div>
              <dl className="mt-3 space-y-2">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Requirement
                  </dt>
                  <dd className="mt-0.5 text-[14px] leading-relaxed text-foreground">
                    {a.requirement}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Speedup
                  </dt>
                  <dd className="mt-0.5 text-[14px] leading-relaxed text-foreground">
                    {a.speedup}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Caveat
                  </dt>
                  <dd className="mt-0.5 text-[14px] leading-relaxed text-muted-foreground">
                    {a.caveat}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

export function LocalFirst() {
  return (
    <section
      id="architecture"
      data-reveal
      className="reveal scroll-mt-24 border-b border-border bg-surface"
    >
      <Container className="py-20 sm:py-28">
        <SectionNumber n="05" label="Local-first, drawn as a map" />
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            Your media is yours. Here is the whole map.
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Every stage runs on your machine by default. A cloud provider is something you plug in
            per stage, never a place your media silently ends up.
          </p>
        </div>

        <DataPlaneMap />
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Fig. 06 &nbsp;·&nbsp; The default data plane. Nothing crosses the dashed line unless you
          route it there, one stage at a time.
        </p>

        <RequirementsSection />
        <FinePrintSection />
      </Container>
    </section>
  );
}
