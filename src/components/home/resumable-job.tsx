import { SectionHeading } from "@/components/section-heading";
import { Container, SectionNumber } from "@/components/home/shared";
import { ACC, DIM, INK, LINE, PANEL, PANEL_HI } from "@/components/home/helpers";
import {
  JOB_STAGES,
  statusColor,
  statusLabel,
  type FailureInfo,
  type FailureKind,
  type JobStage,
  type JobStageStatus,
  type LogEntry,
} from "@/components/home/resumable-job-model";
import { useResumableJob } from "@/components/home/use-resumable-job";

const FAILURE_BUTTONS: [FailureKind, string][] = [
  ["gpu_oom", "GPU OOM"],
  ["missing_codec", "Missing codec"],
  ["partial_ingest", "Partial ingest"],
];

const LOG_COLOR: Record<LogEntry["kind"], string> = {
  ok: INK,
  warn: ACC,
  info: DIM,
};

function JobControls({
  running,
  pauseDisabled,
  editDisabled,
  onTogglePause,
  onEditTranslation,
  onReset,
}: {
  running: boolean;
  pauseDisabled: boolean;
  editDisabled: boolean;
  onTogglePause: () => void;
  onEditTranslation: () => void;
  onReset: () => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: DIM }}>
        Job · interview_de.mp4 → en-US &nbsp;·&nbsp; checkpoint dir: /projects/interview/.trackdub
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onTogglePause}
          disabled={pauseDisabled}
          className="inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors disabled:opacity-40"
          style={{
            color: INK,
            borderColor: running ? ACC : LINE,
            background: running ? "transparent" : PANEL_HI,
          }}
          aria-label={running ? "Pause job" : "Resume job"}
        >
          {running ? "❚❚ Pause" : "▶ Resume"}
        </button>
        <button
          type="button"
          onClick={onEditTranslation}
          disabled={editDisabled}
          className="inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors"
          style={{ color: INK, borderColor: LINE, background: PANEL_HI }}
        >
          ✎ Edit line 42
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors"
          style={{ color: DIM, borderColor: LINE }}
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}

function FailureSimulator({ onInject }: { onInject: (kind: FailureKind) => void }) {
  return (
    <div
      className="mb-5 flex flex-wrap items-center gap-2 border-t border-b py-3"
      style={{ borderColor: LINE }}
    >
      <span
        className="mr-1 font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{ color: DIM }}
      >
        Simulate failure
      </span>
      {FAILURE_BUTTONS.map(([k, label]) => (
        <button
          key={k}
          type="button"
          onClick={() => onInject(k)}
          className="inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-accent"
          style={{ color: INK, borderColor: LINE, background: "transparent" }}
        >
          ⚠ {label}
        </button>
      ))}
    </div>
  );
}

function FailureAlert({ failure, onRecover }: { failure: FailureInfo; onRecover: () => void }) {
  return (
    <div
      role="alert"
      className="mb-5 border p-4"
      style={{
        borderColor: "oklch(0.55 0.14 30)",
        background: "oklch(0.20 0.04 30 / 0.35)",
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: "oklch(0.78 0.15 258)" }}
          >
            {failure.code}
          </span>
          <span className="font-serif text-[17px]" style={{ color: INK }}>
            {failure.title}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: DIM }}>
          Stage · {failure.stage} · paused, checkpoint saved
        </span>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed" style={{ color: "oklch(0.82 0.02 245)" }}>
        {failure.detail}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onRecover}
          className="inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em]"
          style={{ color: INK, borderColor: ACC, background: PANEL_HI }}
        >
          ✓ {failure.recoverLabel}
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: DIM }}>
          or reset · nothing on disk was destroyed
        </span>
      </div>
    </div>
  );
}

function StageRow({
  stage,
  status,
  progress,
}: {
  stage: JobStage;
  status: JobStageStatus;
  progress: number;
}) {
  const pct = Math.round(progress * 100);
  return (
    <li
      className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t py-3 first:border-t-0"
      style={{ borderColor: LINE }}
    >
      <div className="flex items-center gap-3">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: statusColor(status) }}
          aria-hidden
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: DIM }}>
          {stage.n}
        </span>
        <span className="text-[14px]" style={{ color: INK }}>
          {stage.label}
        </span>
      </div>
      <div
        className="relative h-[6px] w-full overflow-hidden"
        style={{ background: "oklch(0.22 0.012 250)" }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${stage.label} progress`}
      >
        <div
          className="absolute inset-y-0 left-0 transition-[width] duration-100"
          style={{
            width: `${pct}%`,
            background: statusColor(status),
            opacity: status === "stale" ? 0.25 : 1,
          }}
        />
      </div>
      <div className="flex items-center gap-3 justify-self-end">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.14em] tabular-nums"
          style={{ color: DIM }}
        >
          {statusLabel(status, pct)}
        </span>
      </div>
    </li>
  );
}

function JobLog({ log }: { log: LogEntry[] }) {
  return (
    <div className="mt-6 border-t pt-4" style={{ borderColor: LINE }}>
      <div
        className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{ color: DIM }}
      >
        Job log · streaming
      </div>
      <div
        className="max-h-40 overflow-y-auto font-mono text-[12px] leading-relaxed"
        aria-live="polite"
      >
        {log.slice(-8).map((l, i) => (
          <div key={i} className="flex gap-3">
            <span className="tabular-nums" style={{ color: DIM }}>
              {l.t}
            </span>
            <span style={{ color: LOG_COLOR[l.kind] }}>{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResumableJob() {
  const {
    job,
    running,
    failure,
    log,
    allDone,
    togglePause,
    editTranslation,
    injectFailure,
    recover,
    reset,
  } = useResumableJob();

  return (
    <section id="resume" data-reveal className="reveal border-b border-border bg-background">
      <Container className="py-20 sm:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow={<SectionNumber n="02b" label="Resumable jobs" />}
              title="Pause anything. Edit one stage. Resume only what changed."
              lead="Every stage writes a checkpoint to disk. Close the app, unplug the laptop, edit a translation two days later, and the job picks up from the last completed artifact."
              h2ClassName="mt-6 font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl"
              leadClassName="mt-6 text-[17px] leading-relaxed text-muted-foreground"
            />
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              When you change a translated line, Trackdub marks that stage and everything downstream
              as <em>stale</em> and requeues only those. Ingest, transcription, and diarization stay
              done; they don't depend on the edit.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Try it → pause · edit translation · resume
            </p>
          </div>

          <div className="lg:col-span-8">
            <div
              className="not-prose rounded-none border p-5 sm:p-6"
              style={{ background: PANEL, borderColor: LINE }}
            >
              <JobControls
                running={running}
                pauseDisabled={allDone || !!failure}
                editDisabled={!!failure}
                onTogglePause={togglePause}
                onEditTranslation={editTranslation}
                onReset={reset}
              />

              <FailureSimulator onInject={injectFailure} />

              {failure && <FailureAlert failure={failure} onRecover={recover} />}

              {/* stage rows */}
              <ol className="divide-y" style={{ borderColor: LINE }}>
                {JOB_STAGES.map((s) => (
                  <StageRow
                    key={s.id}
                    stage={s}
                    status={job.status[s.id]}
                    progress={job.progress[s.id]}
                  />
                ))}
              </ol>

              <JobLog log={log} />
            </div>

            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Fig. 02b &nbsp;·&nbsp; Simulated job runner with failure injection. Progress, errors,
              and log are client-side only.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- product plate (single figure) ---------------- */
