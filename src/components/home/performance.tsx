import { SectionHeading } from "@/components/section-heading";
import { SectionNumber } from "@/components/home/shared";

export function Performance() {
  return (
    <section id="performance" data-reveal className="reveal border-b border-border bg-surface">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow={<SectionNumber n="04" label="Performance" />}
              title="Runs on the hardware you already have."
              lead="Trackdub can select TensorRT RTX, CUDA, DirectML, CoreML, MIGraphX, OpenVINO, QNN, or CPU per stage. Pick a policy or let it choose automatically. The tiers below are directional; measured benchmarks publish via DubBench ahead of v1 launch."
              h2ClassName="mt-6 font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl"
              leadClassName="mt-6 text-[17px] leading-relaxed text-muted-foreground"
            />
          </div>
          <div className="lg:col-span-8">
            <ol className="relative">
              {[
                [
                  "TensorRT RTX",
                  "Windows · RTX 30/40/50",
                  "Fastest supported tier",
                  "Selected when the model and RTX runtime are compatible",
                ],
                [
                  "CUDA",
                  "Windows / Linux · NVIDIA",
                  "Fast",
                  "NVIDIA fallback when TensorRT RTX is unavailable",
                ],
                [
                  "CoreML",
                  "macOS · Apple Silicon",
                  "Fast",
                  "Uses Apple Neural Engine and GPU where supported",
                ],
                [
                  "MIGraphX",
                  "Windows 11 · AMD",
                  "Accelerated",
                  "Catalog-delivered AMD GPU lane for compatible ONNX graphs",
                ],
                [
                  "OpenVINO",
                  "Windows 11 · Intel",
                  "Accelerated",
                  "Catalog-delivered Intel CPU, GPU, and NPU lane",
                ],
                [
                  "QNN",
                  "Windows ARM64 · Snapdragon",
                  "Accelerated",
                  "Qualcomm NPU/GPU lane on compatible devices",
                ],
                [
                  "DirectML",
                  "Windows · any DX12 GPU",
                  "Broad coverage",
                  "Intel, AMD, and NVIDIA DirectX 12 hardware",
                ],
                [
                  "CPU (ONNX Runtime)",
                  "All platforms",
                  "Portable baseline",
                  "Always available as the per-stage fallback",
                ],
              ].map(([p, plat, spd, av], i, arr) => (
                <li
                  key={p}
                  data-reveal-child
                  className="reveal-child group/step relative border-b border-border py-4 last:border-b-0 sm:py-5"
                  style={{ marginLeft: `min(${i * 3.5}%, ${i * 34}px)` }}
                >
                  {i > 0 && (
                    <span
                      className="absolute -left-5 top-1/2 hidden -translate-y-1/2 font-mono text-[13px] text-accent sm:block"
                      aria-hidden
                    >
                      ↳
                    </span>
                  )}
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="font-serif text-[21px] leading-tight text-foreground sm:text-[24px]">
                      {p}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {plat}
                    </span>
                    <span className="ml-auto whitespace-nowrap border border-border px-2 py-[2px] font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                      {spd}
                    </span>
                  </div>
                  <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
                    {av}
                    {i === arr.length - 1 ? ". The ladder always lands somewhere." : ""}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Fig. 05 &nbsp;·&nbsp; Per-stage fallback ladder, fastest to most portable. Order, not
              measured throughput; benchmarks publish via DubBench ahead of v1.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- what you get ---------------- */
