import Image from "next/image";
import { ArrowRight } from "lucide-react";

const proofPoints = [
  { value: "25+", label: "Years building in Colorado" },
  { value: "200+", label: "Homes and projects completed" },
  { value: "NoCO", label: "Northern Colorado focus" },
];

// The production photo hero is the launch design. BuildStoryHero is retained
// separately as the owner's future paid upgrade; it is deliberately not loaded.
export default function ProductionHero() {
  return (
    <section aria-labelledby="home-heading" className="relative min-h-[86svh] overflow-hidden bg-[#151515] text-white">
      <Image
        src="/images/project-3/exterior-twilight-front.jpg"
        alt="Kiefer Built custom contemporary ranch home at twilight in Northern Colorado"
        fill
        priority
        sizes="(max-width: 767px) max(100vw, 150svh), 100vw"
        className="object-cover object-[60%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/25 md:from-black/82 md:via-black/48 md:to-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#151515] to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[86svh] max-w-7xl flex-col justify-end px-6 pb-8 pt-28 md:pb-10">
        <div className="max-w-3xl">
          <h1 id="home-heading" className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl md:text-6xl md:leading-[0.95]">
            Custom Homes Built With Precision in Northern Colorado
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
            Kiefer Built Contracting creates custom homes, renovations, and commercial spaces with disciplined planning, premium craftsmanship, and a builder-led process from first conversation to final walkthrough.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#contact" className="inline-flex items-center gap-2 rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]">
              Start A Project <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a href="#projects" className="inline-flex items-center gap-2 rounded-md border border-white/50 bg-black/25 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-black/40">
              View Projects
            </a>
          </div>
        </div>
        <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {proofPoints.map((point) => (
            <div key={point.label} className="border-l border-white/25 pl-4">
              <p className="text-3xl font-bold">{point.value}</p>
              <p className="mt-1 text-sm leading-5 text-white/85">{point.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
