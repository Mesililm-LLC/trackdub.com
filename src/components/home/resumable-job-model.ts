import { ACC } from "@/components/home/helpers";

export type JobStageId = "ingest" | "transcribe" | "translate" | "diarize" | "voice" | "mix";

export type JobStageStatus = "queued" | "running" | "paused" | "done" | "stale" | "failed";

export const JOB_STAGES: {
  id: JobStageId;
  n: string;
  label: string;
  sec: number;
  artifact: string;
}[] = [
  { id: "ingest", n: "01", label: "Ingest & probe", sec: 2.0, artifact: "media.probe.json" },
  {
    id: "transcribe",
    n: "02",
    label: "Transcribe (ASR)",
    sec: 6.5,
    artifact: "transcript.de.jsonl",
  },
  { id: "translate", n: "03", label: "Translate", sec: 3.5, artifact: "transcript.en.jsonl" },
  { id: "diarize", n: "04", label: "Diarize", sec: 4.0, artifact: "speakers.rttm" },
  { id: "voice", n: "05", label: "Voice (TTS)", sec: 7.0, artifact: "lines/*.wav" },
  { id: "mix", n: "06", label: "Mix & mux", sec: 3.0, artifact: "interview_en.mp4" },
];

export type JobStage = (typeof JOB_STAGES)[number];

const DOWNSTREAM_OF_TRANSLATE: JobStageId[] = ["translate", "voice", "mix"];

export type JobState = {
  status: Record<JobStageId, JobStageStatus>;
  progress: Record<JobStageId, number>;
};

export function initialJobState(): JobState {
  return {
    status: {
      ingest: "done",
      transcribe: "done",
      translate: "running",
      diarize: "queued",
      voice: "queued",
      mix: "queued",
    },
    progress: { ingest: 1, transcribe: 1, translate: 0.35, diarize: 0, voice: 0, mix: 0 },
  };
}

export type LogEntry = { t: string; msg: string; kind: "info" | "warn" | "ok" };

export type FailureKind = "gpu_oom" | "missing_codec" | "partial_ingest";

export type FailureInfo = {
  kind: FailureKind;
  stage: JobStageId;
  code: string;
  title: string;
  detail: string;
  recoverLabel: string;
  recoveryNote: string;
  fromCheckpoint: number; // resume progress fraction
  applyRecovery?: () => Partial<Record<JobStageId, JobStageStatus>>;
};

export const FAILURES: Record<FailureKind, Omit<FailureInfo, "applyRecovery">> = {
  gpu_oom: {
    kind: "gpu_oom",
    stage: "voice",
    code: "E_GPU_OOM",
    title: "GPU ran out of memory during voice generation",
    detail:
      "The TensorRT RTX engine for the voice model needed 8.4 GB but 6.1 GB were free on the selected device (RTX 4070). Trackdub paused the job at line 63 of 128 and kept every finished line on disk.",
    recoverLabel: "Retry on DirectML at half batch",
    recoveryNote:
      "Switching provider to DirectML (batch 4). Already-rendered lines 1–62 are reused from the checkpoint.",
    fromCheckpoint: 0.49,
  },
  missing_codec: {
    kind: "missing_codec",
    stage: "ingest",
    code: "E_MEDIA_CODEC",
    title: "Ingest could not decode one audio track",
    detail:
      "FFmpeg opened interview_de.mp4 but track #2 uses an EAC3 stream that this build cannot decode. Video and track #1 were probed successfully; the file was not modified.",
    recoverLabel: "Install decoder & rescan",
    recoveryNote:
      "Installed the missing EAC3 decoder. Re-probing the container; video and existing tracks are reused, only the audio scan re-runs.",
    fromCheckpoint: 0.6,
  },
  partial_ingest: {
    kind: "partial_ingest",
    stage: "transcribe",
    code: "E_TRUNCATED_STREAM",
    title: "Source media ended mid-segment",
    detail:
      "The last 3.2s of interview_de.mp4 are missing packets, likely a truncated export. Trackdub transcribed 124 of 128 segments and saved them. Nothing was discarded.",
    recoverLabel: "Continue with 124 saved segments",
    recoveryNote:
      "Accepted partial ingest. Downstream stages will run on the 124 valid segments; the truncated tail is flagged in the transcript for review.",
    fromCheckpoint: 0.97,
  },
};

export function initialLog(translateVerb: "started" | "resumed"): LogEntry[] {
  return [
    { t: "00:00", msg: "Job queued · interview_de.mp4 → en-US", kind: "info" },
    { t: "00:02", msg: "Ingest complete · media.probe.json", kind: "ok" },
    { t: "00:09", msg: "Transcribe complete · 128 segments", kind: "ok" },
    { t: "00:09", msg: `Translate ${translateVerb} · model=nllb-1.3b`, kind: "info" },
  ];
}

export function formatClock(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function appendLog(prev: LogEntry[], entry: LogEntry): LogEntry[] {
  return [...prev.slice(-40), entry];
}

export function isJobDone(job: JobState): boolean {
  return JOB_STAGES.every((s) => job.status[s.id] === "done");
}

export type JobStep = { job: JobState; log?: Pick<LogEntry, "msg" | "kind"> };

function isPending(status: JobStageStatus): boolean {
  return status === "queued" || status === "stale";
}

function startNextStage(prev: JobState): JobStep {
  const next = JOB_STAGES.find((s) => isPending(prev.status[s.id]));
  if (!next) return { job: prev };
  const label =
    prev.status[next.id] === "stale"
      ? `${next.label} reprocessing (stale after edit)`
      : `${next.label} started`;
  return {
    job: { ...prev, status: { ...prev.status, [next.id]: "running" } },
    log: { msg: label, kind: "info" },
  };
}

function advanceRunningStage(prev: JobState, stage: JobStage, dt: number): JobStep {
  const inc = dt / stage.sec;
  const cur = prev.progress[stage.id] + inc;
  if (cur >= 1) {
    return {
      job: {
        status: { ...prev.status, [stage.id]: "done" },
        progress: { ...prev.progress, [stage.id]: 1 },
      },
      log: { msg: `${stage.label} complete · ${stage.artifact}`, kind: "ok" },
    };
  }
  return {
    job: {
      ...prev,
      progress: { ...prev.progress, [stage.id]: cur },
    },
  };
}

/** One simulation tick: advance the running stage, or start the next pending one. */
export function advanceJob(prev: JobState, dt: number): JobStep {
  const runningStage = JOB_STAGES.find((s) => prev.status[s.id] === "running");
  return runningStage ? advanceRunningStage(prev, runningStage, dt) : startNextStage(prev);
}

/** Pause moves running stages to paused; resume moves paused stages back to running. */
export function setJobPaused(prev: JobState, paused: boolean): JobState {
  const from: JobStageStatus = paused ? "running" : "paused";
  const to: JobStageStatus = paused ? "paused" : "running";
  const s = { ...prev.status };
  for (const st of JOB_STAGES) if (s[st.id] === from) s[st.id] = to;
  return { ...prev, status: s };
}

export function markDownstreamStale(prev: JobState): JobState {
  const s = { ...prev.status };
  const p = { ...prev.progress };
  for (const id of DOWNSTREAM_OF_TRANSLATE) {
    s[id] = "stale";
    p[id] = 0;
  }
  // Force the pipeline to re-enter translate on next tick.
  // Any stage after translate that was 'running' is now 'stale' (above),
  // and the tick loop will pick the first non-done stage.
  return { status: s, progress: p };
}

// Stages before the failing one are done, the failing stage is failed, later ones are queued.
function failedRunOutcome(
  index: number,
  failedIndex: number,
  checkpoint: number,
): [JobStageStatus, number] {
  if (index === failedIndex) return ["failed", checkpoint];
  if (index < failedIndex) return ["done", 1];
  return ["queued", 0];
}

export function failJob(
  prev: JobState,
  info: Pick<FailureInfo, "stage" | "fromCheckpoint">,
): JobState {
  const s: JobState["status"] = { ...prev.status };
  const p: JobState["progress"] = { ...prev.progress };
  const failedIndex = JOB_STAGES.findIndex((st) => st.id === info.stage);
  JOB_STAGES.forEach((st, i) => {
    [s[st.id], p[st.id]] = failedRunOutcome(i, failedIndex, info.fromCheckpoint);
  });
  return { status: s, progress: p };
}

export function resumeFailedStage(prev: JobState, stage: JobStageId): JobState {
  const s = { ...prev.status };
  s[stage] = "running";
  return { ...prev, status: s };
}

const STATUS_COLOR: Record<JobStageStatus, string> = {
  done: "oklch(0.72 0.10 155)",
  running: ACC,
  paused: "oklch(0.70 0.02 245)",
  stale: ACC,
  failed: "oklch(0.68 0.16 30)",
  queued: "oklch(0.38 0.014 250)",
};

export function statusColor(s: JobStageStatus): string {
  return STATUS_COLOR[s];
}

const STATUS_LABEL: Record<JobStageStatus, (pct: number) => string> = {
  done: () => "done",
  running: (pct) => `${pct}%`,
  paused: (pct) => `paused · ${pct}%`,
  stale: () => "stale · requeued",
  failed: (pct) => `failed · ${pct}%`,
  queued: () => "queued",
};

export function statusLabel(s: JobStageStatus, pct: number): string {
  return STATUS_LABEL[s](pct);
}
