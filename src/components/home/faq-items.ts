export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Does my video get uploaded anywhere?",
    a: "No. Trackdub runs the whole pipeline on your machine by default. Cloud endpoints exist for teams that want them, but they're opt-in per project and per stage, never implicit.",
  },
  {
    q: "What happens to my data if I uninstall?",
    a: "Your projects, source media, and generated output live in folders you chose, so they stay where they are until you delete them. The app data directory (model cache, preferences, and logs) can be removed during uninstall or manually from %LOCALAPPDATA%\\Trackdub.",
  },
  {
    q: "Can I use it commercially?",
    a: "Yes, on every tier, including Free. Free exports carry a small watermark and cap at 5 minutes; Pro removes both. Every bundled model is commercial-safe by manifest, so nothing research-only ever loads.",
  },
  {
    q: "How is the voice cloning handled?",
    a: "Each detected speaker gets one short reference clip you can review or replace. The voicing stage uses that reference: one voice per person, not one 'AI voice' for the whole video. References stay on your disk.",
  },
  {
    q: "What if the ASR gets a word wrong?",
    a: "Fix it in the transcript. The translation for that line invalidates, the voicing for that line queues for a regen, and nothing else rebuilds. Every stage declares its inputs, so edits propagate exactly as far as they need to.",
  },
  {
    q: "Do I need a GPU?",
    a: "No. CPU execution is the portable baseline. Compatible hardware can use TensorRT RTX, CUDA, DirectML, CoreML, MIGraphX, OpenVINO, or QNN per stage, with automatic fallback when a provider or model combination is unavailable.",
  },
  {
    q: "Can I automate it?",
    a: "Yes. The CLI ships in every tier, Free included. The same pipeline the app runs is scriptable for batch localization, CI, or an on-prem REST worker via the SDK.",
  },
  {
    q: "Can the whole pipeline run offline?",
    a: "Yes. Once the models you selected are downloaded, every bundled stage can run without an internet connection. Hosted translation or voice providers are optional and configured one stage at a time.",
  },
  {
    q: "Can I choose which accelerator Trackdub uses?",
    a: "Yes. Automatic mode selects the best compatible provider per stage, while an execution policy lets you prefer or exclude providers. A stage can fall back without changing the rest of the project.",
  },
  {
    q: "What operating systems are supported?",
    a: "Trackdub targets Windows, macOS, and Linux with the same project format. Available acceleration providers differ by operating system and hardware, but CPU execution remains the portable fallback.",
  },
  {
    q: "Can I use a cloud provider for only one stage?",
    a: "Yes. You can route translation or voice generation to a provider you configure while keeping ingest, transcription, timing, mixing, and the rest of the project local.",
  },
  {
    q: "How are model licenses handled?",
    a: "Every bundled model is declared in the model manifest with its source, checksum, and commercial-use lane. Unknown or research-only licenses are not treated as safe bundled defaults.",
  },
];
