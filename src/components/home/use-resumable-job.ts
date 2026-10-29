import { useEffect, useRef, useState } from "react";
import {
  FAILURES,
  advanceJob,
  appendLog,
  failJob,
  formatClock,
  initialJobState,
  initialLog,
  isJobDone,
  markDownstreamStale,
  resumeFailedStage,
  setJobPaused,
  type FailureInfo,
  type FailureKind,
  type JobState,
  type LogEntry,
} from "@/components/home/resumable-job-model";

const TICK_SECONDS = 0.12;
const TICK_MS = 120;
const CLOCK_START_SECONDS = 9;

export function useResumableJob() {
  const [job, setJob] = useState<JobState>(initialJobState);
  const [running, setRunning] = useState(true);
  const [failure, setFailure] = useState<FailureInfo | null>(null);
  const [log, setLog] = useState<LogEntry[]>(() => initialLog("started"));
  const clockRef = useRef(CLOCK_START_SECONDS);

  const addLog = (msg: string, kind: LogEntry["kind"] = "info") => {
    const t = formatClock(clockRef.current);
    setLog((prev) => appendLog(prev, { t, msg, kind }));
  };

  useEffect(() => {
    if (!running || failure) return;
    const iv = window.setInterval(() => {
      clockRef.current += TICK_SECONDS;
      setJob((prev) => {
        const step = advanceJob(prev, TICK_SECONDS);
        if (step.log) {
          const { msg, kind } = step.log;
          queueMicrotask(() => addLog(msg, kind));
        }
        return step.job;
      });
    }, TICK_MS);
    return () => window.clearInterval(iv);
  }, [running, failure]);

  const togglePause = () => {
    if (failure) return;
    setRunning((r) => {
      const next = !r;
      setJob((prev) => setJobPaused(prev, !next));
      addLog(
        next ? "Resume · continuing from last checkpoint" : "Pause · state persisted to disk",
        "warn",
      );
      return next;
    });
  };

  const editTranslation = () => {
    setJob(markDownstreamStale);
    addLog("Edit · line 42 target text changed by user", "warn");
    addLog("Stale · translate, voice, mix marked for reprocess", "warn");
    // Prior stages (ingest, transcribe, diarize) remain done — not recomputed.
  };

  const injectFailure = (kind: FailureKind) => {
    const info = FAILURES[kind];
    setJob((prev) => failJob(prev, info));
    setRunning(false);
    setFailure(info);
    addLog(`FAIL · ${info.code} · ${info.title.toLowerCase()}`, "warn");
    addLog(
      `Paused · checkpoint saved at ${info.stage} ${(info.fromCheckpoint * 100).toFixed(0)}%`,
      "warn",
    );
  };

  const recover = () => {
    if (!failure) return;
    const info = failure;
    addLog(`Recovery · ${info.recoveryNote}`, "info");
    setJob((prev) => resumeFailedStage(prev, info.stage));
    setFailure(null);
    setRunning(true);
  };

  const reset = () => {
    clockRef.current = CLOCK_START_SECONDS;
    setJob(initialJobState());
    setRunning(true);
    setFailure(null);
    setLog(initialLog("resumed"));
  };

  return {
    job,
    running,
    failure,
    log,
    allDone: isJobDone(job),
    togglePause,
    editTranslation,
    injectFailure,
    recover,
    reset,
  };
}
