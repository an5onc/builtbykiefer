import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, Layers3, Ruler, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createMarketingMetadata } from "@/lib/public-site/metadata";

export const metadata = createMarketingMetadata({
  title: "Custom Residential Elevators | Kiefer Built Contracting",
  description:
    "Custom residential elevator builds and installations coordinated with structure, finish work, access planning, and designer-selected details in Northern Colorado.",
  pathname: "/services/custom-elevators",
  image: "/images/project-4/DSC05502.jpg",
  imageAlt: "Custom glass residential elevator installed by Kiefer Built Contracting",
});

const proofPoints = [
  "Residential elevator builds",
  "Designer-selected finishes",
  "Structure and field coordination",
];

const serviceFits = [
  {
    title: "Long-term access",
    body:
      "Create easier movement between levels for aging-in-place planning, multigenerational homes, and future-ready remodels.",
  },
  {
    title: "Designer-led remodels",
    body:
      "Coordinate the elevator with adjacent cabinetry, flooring, wall treatments, lighting, and room transitions from the start.",
  },
  {
    title: "Tight existing homes",
    body:
      "Work through access, protection, sequencing, and finish details when an elevator needs to fit into an existing floor plan.",
  },
];

const process = [
  {
    icon: Ruler,
    title: "Plan the opening",
    body:
      "Review floor plans, structure, clearances, access, and adjacent rooms before the project gets locked into finishes.",
  },
  {
    icon: Layers3,
    title: "Coordinate the build",
    body:
      "Manage framing, trade sequencing, field conditions, and finish transitions so the elevator does not feel patched in.",
  },
  {
    icon: ClipboardCheck,
    title: "Protect the details",
    body:
      "Align flooring, trim, cabinetry, doors, panels, and lighting with the designer's intent and the owner's daily use.",
  },
  {
    icon: ShieldCheck,
    title: "Finish for daily use",
    body:
      "Close the project with clear walkthroughs, clean finish work, and practical expectations for long-term operation.",
  },
];

const gallery = [
  {
    src: "/images/project-4/DSC05502.jpg",
    alt: "Custom glass residential elevator installed by Kiefer Built Contracting",
    label: "Glass elevator enclosure",
  },
  {
    src: "/images/project-4/DSC05496.jpg",
    alt: "Custom elevator integrated near laundry and living space by Kiefer Built Contracting",
    label: "Integrated room access",
  },
  {
    src: "/images/project-4/DSC05499.jpg",
    alt: "Custom elevator finish transition near utility cabinetry by Kiefer Built Contracting",
    label: "Finish coordination",
  },
  {
    src: "/images/project-4/DSC05505.jpg",
    alt: "Custom residential elevator doorway and wall finish by Kiefer Built Contracting",
    label: "Door and wall detailing",
  },
];

export default function CustomElevatorsPage() {
  return (
    <div className="bg-white text-[#171717]">
      <Header />
      <main id="main-content">
        <section className="relative overflow-hidden bg-[#151515] text-white">
          <div className="absolute inset-0">
            <Image
              src="/images/project-4/DSC05502.jpg"
              alt="Custom residential elevator by Kiefer Built Contracting"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-34"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/28" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#151515] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto grid min-h-[88vh] max-w-7xl gap-10 px-6 pb-12 pt-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="pb-4">
              <h1 className="max-w-3xl text-5xl font-bold leading-[0.95] text-white md:text-7xl">
                Custom Residential Elevators
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
                Elevator builds and installations planned with the home around them: structure, finish transitions, flooring, cabinetry, access, and designer-selected details handled by one accountable builder.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
                >
                  Discuss An Elevator
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-md border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white/10"
                >
                  View Services
                </Link>
              </div>
              <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
                {proofPoints.map((point) => (
                  <p key={point} className="border-l border-white/25 pl-4 text-sm font-bold uppercase tracking-[0.12em] text-white/76">
                    {point}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[0.88fr_1fr]">
              <div className="relative min-h-[430px] overflow-hidden rounded-md bg-[#232323] shadow-2xl ring-1 ring-white/12 sm:min-h-[560px]">
                <Image
                  src="/images/project-4/DSC05502.jpg"
                  alt="Round glass elevator with finished interior detailing by Kiefer Built Contracting"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 42vw, 28vw"
                  className="object-cover"
                />
              </div>
              <div className="grid gap-4">
                <div className="relative min-h-[260px] overflow-hidden rounded-md bg-[#232323] ring-1 ring-white/12">
                  <Image
                    src="/images/project-4/DSC05496.jpg"
                    alt="Residential elevator integrated into finished home spaces"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 34vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative min-h-[260px] overflow-hidden rounded-md bg-[#232323] ring-1 ring-white/12">
                  <Image
                    src="/images/project-4/DSC05499.jpg"
                    alt="Custom elevator access beside finished utility room cabinetry"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 34vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f9f6f0] px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-bold leading-tight md:text-5xl">
                Built into the home, not added as an afterthought.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#655c52]">
                A residential elevator touches structure, access, finish work, and the daily experience of the home. Kiefer Built coordinates the construction details around the elevator so designers and homeowners are not left solving field conflicts late in the project.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {serviceFits.map((item) => (
                <article key={item.title} className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-[#171717]">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#655c52]">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <h2 className="text-3xl font-bold leading-tight md:text-5xl">
                  One builder coordinating structure, elevator access, and finished rooms.
                </h2>
                <p className="mt-5 text-lg leading-8 text-[#655c52]">
                  The best elevator projects are resolved before trades are improvising around them. Kiefer Built keeps the field details, finish expectations, and owner communication tied together.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {process.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article key={item.title} className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
                      <Icon className="size-7 text-[#c9281c]" />
                      <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                      <p className="mt-3 text-base leading-7 text-[#655c52]">{item.body}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#232323] px-6 py-20 text-white md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold leading-tight md:text-5xl">Project photography with the elevator as the focus.</h2>
                <p className="mt-5 text-lg leading-8 text-white/70">
                  Real Kiefer Built project images showing the elevator enclosure, access points, and surrounding finish coordination.
                </p>
              </div>
              <Link href="/#contact" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-[#ff6b5c]">
                Start The Conversation
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {gallery.map((item) => (
                <article key={item.src} className="group overflow-hidden rounded-md bg-[#151515] ring-1 ring-white/12">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/8 to-transparent" />
                    <p className="absolute inset-x-0 bottom-0 p-5 text-sm font-bold uppercase tracking-[0.12em] text-white">
                      {item.label}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16 md:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Planning an elevator into a home or remodel?</h2>
              <p className="mt-3 max-w-2xl text-[#655c52]">
                Share the floor plan, design intent, site constraints, and access goals. Kiefer Built can help determine fit before details get expensive to unwind.
              </p>
            </div>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
            >
              Start A Project
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
