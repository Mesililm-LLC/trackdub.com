export const STAGES = [
  {
    n: "01",
    name: "Ingest",
    one: "Probe media. Detect scenes, silence, and speech.",
    body: "Point Trackdub at a file or folder. It reads the container, extracts audio, detects shot boundaries, and runs voice activity, building the frame every later stage will work against.",
    detail: ["ffprobe media", "shot / silence detection", "loudness reference (LUFS)"],
  },
  {
    n: "02",
    name: "Transcribe",
    one: "Time-accurate source transcript with speaker turns.",
    body: "Source-language ASR with word-level timestamps. The transcript is a real editable document, not an opaque intermediate. Fix a word here and every downstream stage picks it up.",
    detail: ["word timestamps", "editable transcript", "diarization-ready turns"],
  },
  {
    n: "03",
    name: "Translate",
    one: "Human-editable target script, tied to timecode.",
    body: "Translation happens per line, not per file. Idioms, names, and jargon go in a project glossary; the target script preserves the source's timing so later stages can align to it.",
    detail: ["per-line MT", "project glossary", "timecode preserved"],
  },
  {
    n: "04",
    name: "Diarize",
    one: "Assign speakers. Attach a voice reference to each one.",
    body: "Trackdub clusters voices, then lets you name them, merge them, or split them. Each speaker gets a short reference clip that the voicing stage will match: one clone per person, not one voice for the whole video.",
    detail: ["speaker clustering", "manual merge / split", "voice reference per speaker"],
  },
  {
    n: "05",
    name: "Voice",
    one: "Zero-shot TTS. Regenerate any single line.",
    body: "Per-speaker voice cloning generates each line at its target duration. Prosody is editable (pace, emphasis, pause), and any line can be regenerated on its own without redoing the rest.",
    detail: ["per-speaker cloning", "per-line prosody", "regen line 42 in isolation"],
  },
  {
    n: "06",
    name: "Mix",
    one: "Align, duck under music, mux the final file.",
    body: "Dubbed lines snap to the original beats. Music and SFX from the source are preserved and ducked under dialogue. Export a muxed video, stems, or captions, deterministic given the same project manifest.",
    detail: ["timeline alignment", "music / SFX ducking", "video + stems + captions"],
  },
];
