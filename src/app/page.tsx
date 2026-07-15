import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

const proofPoints = [
  { value: "25+", label: "Years building in Colorado" },
  { value: "200+", label: "Homes and projects completed" },
  { value: "NoCO", label: "Northern Colorado focus" },
];

const serviceGallery = [
  {
    title: "Custom Home Exteriors",
    image: "/images/project-3/exterior-twilight-front.jpg",
    detail: "Stone, wood, and clean modern massing.",
  },
  {
    title: "Open Living Spaces",
    image: "/images/project-3/interior-great-room-wide.jpg",
    detail: "Interior finish work built around daily use.",
  },
  {
    title: "Kitchen Remodels",
    image: "/images/project-1/kitchen-8.jpg",
    detail: "Cabinetry, counters, lighting, and layout coordination.",
  },
  {
    title: "Mountain Builds",
    image: "/images/project-2/exterior-front-facade.jpg",
    detail: "Durable exterior systems for Colorado conditions.",
  },
  {
    title: "Primary Suites",
    image: "/images/project-3/interior-master-suite.jpg",
    detail: "Comfortable rooms with considered details.",
  },
  {
    title: "Bathrooms",
    image: "/images/project-3/interior-primary-bath.jpg",
    detail: "Tile, fixtures, and finish decisions managed clearly.",
  },
  {
    title: "Acreage & Site Work",
    image: "/images/project-2/exterior-wide-property.jpg",
    detail: "Project planning that respects the site.",
  },
  {
    title: "Final Details",
    image: "/images/project-3/kitchen-island-front.jpg",
    detail: "Craft-first execution from structure to finish.",
  },
  {
    title: "Custom Elevators",
    image: "/images/project-4/DSC05496.jpg",
    detail: "Residential elevator builds and finish integration.",
  },
];

const processSteps = [
  "Establish project goals, site conditions, budget range, and decision makers.",
  "Define scope, selections path, schedule, and proposal expectations before work begins.",
  "Coordinate trades, materials, inspections, and communication throughout construction.",
  "Complete a detailed walkthrough, resolve final items, and close the project with confidence.",
];

const serviceAreas = ["Windsor", "Fort Collins", "Loveland", "Greeley", "Timnath", "Northern Colorado"];

export default function Home() {
  return (
    <div className="bg-white text-[#171717]">
      <Header />
      <main id="main-content">
        <section className="relative min-h-[86vh] overflow-hidden bg-[#151515] text-white">
          <Image
            src="/images/project-3/exterior-twilight-front.jpg"
            alt="Kiefer Built custom contemporary ranch home at twilight in Northern Colorado"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/48 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#151515] to-transparent" />

          <div className="relative z-10 mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-end px-6 pb-8 pt-28 md:pb-10">
            <div className="max-w-3xl">
              <h1 className="max-w-3xl text-5xl font-bold leading-[0.95] tracking-[-0.01em] text-white md:text-6xl">
                Custom Homes Built With Precision in Northern Colorado
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
                Kiefer Built Contracting creates custom homes, renovations, and commercial spaces with disciplined planning, premium craftsmanship, and a builder-led process from first conversation to final walkthrough.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
                >
                  Start A Project
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white/10"
                >
                  View Projects
                </a>
              </div>
            </div>

            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
              {proofPoints.map((point) => (
                <div key={point.label} className="border-l border-white/25 pl-4">
                  <p className="text-3xl font-bold">{point.value}</p>
                  <p className="mt-1 text-sm leading-5 text-white/68">{point.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-[#151515] px-6 pb-20 pt-8 text-white md:pb-24 md:pt-10">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <h2 className="text-3xl font-bold leading-tight md:text-5xl">
                Built around trust, not shortcuts.
              </h2>
            </div>
            <div className="max-w-3xl">
              <p className="text-lg leading-8 text-white/72">
                Kiefer Built&apos;s story is simple: real homes, practical communication, careful trade coordination, and finish work that holds up after move-in.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["Custom planning", "Clear communication", "Craft-first execution"].map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm font-semibold text-white/86">
                    <CheckCircle2 className="size-4 text-[#c9281c]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="overflow-hidden bg-white py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold leading-tight md:text-5xl">Real project work, moving across the page.</h2>
                <p className="mt-4 text-lg leading-8 text-[#655c52]">
                  Custom homes, remodels, kitchens, bathrooms, exterior work, and finish details all shown with real Kiefer Built project photography.
                </p>
              </div>
              <a href="#contact" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-[#c9281c]">
                Discuss A Similar Build
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>

          <div className="relative mt-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent md:w-32" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent md:w-32" />
            <div className="kiefer-marquee flex w-max gap-5 pr-5">
              {[...serviceGallery, ...serviceGallery].map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="group w-[280px] shrink-0 overflow-hidden rounded-md bg-[#151515] shadow-sm ring-1 ring-black/10 sm:w-[360px] lg:w-[420px]"
                  aria-hidden={index >= serviceGallery.length}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={index < serviceGallery.length ? `${item.title} by Kiefer Built Contracting` : ""}
                      fill
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 420px"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/76">{item.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="custom-elevators" className="bg-[#232323] px-6 py-20 text-white md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c9281c]">New Service</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                Custom elevators for homes, designers, and long-term access.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/72">
                Kiefer Built now builds and installs custom residential elevators, coordinating structure, finish transitions, flooring, cabinetry, and adjacent rooms so the lift feels planned into the home from the start.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {["Designer-ready details", "Residential installs", "Finish coordination"].map((item) => (
                  <p key={item} className="border-l-2 border-[#c9281c] pl-4 text-sm font-bold uppercase tracking-[0.12em] text-white/82">
                    {item}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
                >
                  Discuss An Elevator
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="/services/custom-elevators"
                  className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white/10"
                >
                  View The Service
                </a>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-[0.84fr_1fr]">
              <div className="relative min-h-[420px] overflow-hidden rounded-md bg-[#151515] sm:min-h-[520px]">
                <Image
                  src="/images/project-4/DSC05502.jpg"
                  alt="Custom residential elevator installed by Kiefer Built Contracting"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 42vw, 28vw"
                  className="object-cover"
                />
              </div>
              <div className="grid gap-4">
                <div className="relative min-h-[250px] overflow-hidden rounded-md bg-[#151515]">
                  <Image
                    src="/images/project-4/DSC05496.jpg"
                    alt="Custom elevator integrated near laundry and living spaces by Kiefer Built Contracting"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 34vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative min-h-[250px] overflow-hidden rounded-md bg-[#151515]">
                  <Image
                    src="/images/project-4/DSC05499.jpg"
                    alt="Custom elevator installed beside a finished utility space by Kiefer Built Contracting"
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
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c9281c]">The difference</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[#171717] md:text-5xl">
                Built better, from the envelope in.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#655c52]">
                SIPs construction, measurable energy efficiency, and family craftsmanship. See exactly why a Kiefer
                Built home outperforms a conventional build.
              </p>
            </div>
            <Link
              href="/why-kiefer-built"
              className="inline-flex items-center justify-center rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
            >
              Why Kiefer Built
            </Link>
          </div>
        </section>

        <section id="process" className="bg-white px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-3xl font-bold leading-tight md:text-5xl">A disciplined process from consultation to closeout.</h2>
              <p className="mt-5 text-lg leading-8 text-[#655c52]">
                Kiefer Built keeps each phase organized with defined expectations, accountable communication, and the coordination needed to protect budget, schedule, and craftsmanship.
              </p>
            </div>
            <div className="divide-y divide-black/10 border-y border-black/10">
              {processSteps.map((step, index) => (
                <div key={step} className="grid gap-4 py-6 sm:grid-cols-[80px_1fr]">
                  <p className="text-3xl font-bold text-[#c9281c]">{String(index + 1).padStart(2, "0")}</p>
                  <p className="text-lg font-semibold leading-7">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="commercial" className="scroll-mt-24 bg-[#232323] px-6 py-20 text-white md:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-center">
            <div className="relative min-h-[420px] overflow-hidden rounded-md">
              <Image
                src="/images/kiefer-commercial-agfinity.jpg"
                alt="Commercial interior with office stairs and employee kitchen by Kiefer Built Contracting"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
            <div>
              <Building2 className="size-8 text-[#c9281c]" />
              <h2 className="mt-6 text-3xl font-bold leading-tight md:text-5xl">Commercial spaces built around function, durability, and schedule.</h2>
              <p className="mt-5 text-lg leading-8 text-white/72">
                Kiefer Built supports commercial remodels, tenant improvements, office buildouts, and specialized business spaces with clear scopes, trade coordination, and construction standards that protect operations from start to finish.
              </p>
            </div>
          </div>
        </section>

        <section id="service-area" className="bg-white px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <h2 className="text-3xl font-bold leading-tight md:text-5xl">Serving Windsor and Northern Colorado.</h2>
              <p className="mt-5 text-lg leading-8 text-[#655c52]">
                Kiefer Built works across the communities where Northern Colorado families are building, renovating, and planning their next chapter.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {serviceAreas.map((area) => (
                <p key={area} className="rounded-md border border-black/10 bg-[#f9f6f0] px-4 py-3 font-semibold">
                  {area}
                </p>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </div>
  );
}
