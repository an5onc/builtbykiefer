import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import ProductionHero from "@/components/ProductionHero";
import ProjectMarquee from "@/components/ProjectMarquee";
import WallPreview from "@/components/wall-comparison/WallPreview";
import { serviceAreaCities, serviceAreaRegion } from "@/lib/public-site/service-areas";

const serviceGallery = [
  {
    title: "Custom Home Exteriors",
    image: "/images/project-3/exterior-twilight-front.jpg",
    detail: "Stone, wood, and clean modern massing.",
    href: "/projects/greeley",
    action: "View Greeley",
  },
  {
    title: "Open Living Spaces",
    image: "/images/project-3/interior-great-room-wide.jpg",
    detail: "Interior finish work built around daily use.",
    href: "/projects/greeley",
    action: "View Greeley",
  },
  {
    title: "Kitchen Remodels",
    image: "/images/project-1/kitchen-8.jpg",
    detail: "Cabinetry, counters, lighting, and layout coordination.",
    href: "/projects/renovations-additions",
    action: "View renovation gallery",
  },
  {
    title: "Mountain Builds",
    image: "/images/project-2/exterior-front-facade.jpg",
    detail: "Durable exterior systems for Colorado conditions.",
    href: "/projects/mountain-modern",
    action: "View Mountain Modern",
  },
  {
    title: "Primary Suites",
    image: "/images/project-3/interior-master-suite.jpg",
    detail: "Comfortable rooms with considered details.",
    href: "/projects/greeley",
    action: "View Greeley",
  },
  {
    title: "Bathrooms",
    image: "/images/project-3/interior-primary-bath.jpg",
    detail: "Tile, fixtures, and finish decisions managed clearly.",
    href: "/projects/greeley",
    action: "View Greeley",
  },
  {
    title: "Acreage & Site Work",
    image: "/images/project-2/exterior-wide-property.jpg",
    detail: "Project planning that respects the site.",
    href: "/projects/mountain-modern",
    action: "View Mountain Modern",
  },
  {
    title: "Final Details",
    image: "/images/project-3/kitchen-island-front.jpg",
    detail: "Craft-first execution from structure to finish.",
    href: "/projects/greeley",
    action: "View Greeley",
  },
  {
    title: "Custom Elevators",
    image: "/images/project-4/DSC05496.jpg",
    detail: "Residential elevator builds and finish integration.",
    href: "/services/custom-elevators",
    action: "View elevator service",
  },
];

const serviceAreas = [...serviceAreaCities, serviceAreaRegion];

export default function Home() {
  return (
    <div className="bg-white text-charcoal-800">
      <Header />
      <main id="main-content">
        <ProductionHero />

        <section id="about" className="bg-charcoal-800 px-6 py-20 text-white md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <h2 className="text-balance text-3xl font-bold leading-tight tracking-[-0.02em] md:text-5xl">
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
                    <CheckCircle2 className="size-4 text-ember-600" />
                    {item}
                  </p>
                ))}
              </div>
              <p className="mt-8 border-t border-white/15 pt-5 text-sm font-medium tracking-[0.02em] text-white/55">
                25+ years building in Colorado &middot; 200+ homes and projects completed &middot; Rooted in Northern Colorado
              </p>
            </div>
          </div>
        </section>

        <section id="projects" className="overflow-hidden bg-white py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-3xl">
                <h2 className="text-balance text-3xl font-bold leading-tight tracking-[-0.02em] md:text-5xl">
                  Explore our work
                </h2>
                <p className="mt-4 text-lg leading-8 text-boulder-500">
                  Custom homes, remodels, kitchens, bathrooms, exterior work, and finish details all shown with real Kiefer Built project photography.
                  {" "}Open a photo to explore its home tour, renovation gallery, or elevator service.
                </p>
              </div>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-ember-600 transition-colors hover:text-ember-700"
              >
                Discuss A Similar Build
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <ProjectMarquee>
            <div className="kiefer-marquee flex w-max gap-5 pr-5">
              {[...serviceGallery, ...serviceGallery].map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="group w-[280px] shrink-0 overflow-hidden rounded-md bg-charcoal-800 shadow-sm ring-1 ring-black/10 sm:w-[360px] lg:w-[420px]"
                  aria-hidden={index >= serviceGallery.length}
                >
                  <a
                    href={item.href}
                    tabIndex={index >= serviceGallery.length ? -1 : undefined}
                    className="kiefer-project-link relative block aspect-[4/3] overflow-hidden"
                  >
                    <Image
                      src={item.image}
                      alt={index < serviceGallery.length ? `${item.title} by Kiefer Built Contracting` : ""}
                      fill
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 420px"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-colors duration-500 group-hover:from-black/90" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/76 transition-transform duration-500 group-hover:-translate-y-0.5">
                        {item.detail}
                      </p>
                      <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#ffb4a8]">
                        {item.action}<ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                      </p>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </ProjectMarquee>
        </section>

        <section id="custom-elevators" className="bg-steel-800 px-6 py-20 text-white md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-balance text-3xl font-bold leading-tight tracking-[-0.02em] md:text-5xl">
                Custom elevators for homes, designers, and long-term access.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/72">
                Kiefer Built now builds and installs custom residential elevators, coordinating structure, finish transitions, flooring, cabinetry, and adjacent rooms so the lift feels planned into the home from the start.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {["Designer-ready details", "Residential installs", "Finish coordination"].map((item) => (
                  <p key={item} className="text-sm font-bold uppercase tracking-[0.12em] text-white/82">
                    <span className="mb-2 block h-px w-8 bg-ember-600" aria-hidden="true" />
                    {item}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-md bg-ember-600 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-ember-700"
                >
                  Discuss An Elevator
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
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
              <div className="relative min-h-[420px] overflow-hidden rounded-md bg-charcoal-800 sm:min-h-[520px]">
                <Image
                  src="/images/project-4/DSC05502.jpg"
                  alt="Custom residential elevator installed by Kiefer Built Contracting"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 42vw, 28vw"
                  className="object-cover"
                />
              </div>
              <div className="grid gap-4">
                <div className="relative min-h-[250px] overflow-hidden rounded-md bg-charcoal-800">
                  <Image
                    src="/images/project-4/DSC05496.jpg"
                    alt="Custom elevator integrated near laundry and living spaces by Kiefer Built Contracting"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 34vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative min-h-[250px] overflow-hidden rounded-md bg-charcoal-800">
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

        <section className="bg-cream-100 px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-balance text-3xl font-bold leading-tight tracking-[-0.02em] text-charcoal-800 md:text-5xl">
                Built better, from the envelope in.
              </h2>
              <p className="mt-4 text-lg leading-8 text-cream-800">
                SIPs construction, energy-efficiency research, and family craftsmanship. Explore the evidence
                behind envelope decisions and project-specific performance.
              </p>
              <Link
                href="/why-kiefer-built"
                className="group mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-ember-600 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-ember-700"
              >
                Why Kiefer Built
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <WallPreview />
          </div>
        </section>

        <section id="commercial" className="scroll-mt-24 bg-charcoal-700 px-6 py-20 text-white md:py-24">
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
              <Building2 className="size-8 text-ember-600" />
              <h2 className="mt-6 text-balance text-3xl font-bold leading-tight tracking-[-0.02em] md:text-5xl">
                Commercial spaces built around function, durability, and schedule.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/72">
                Kiefer Built supports commercial remodels, tenant improvements, office buildouts, and specialized business spaces with clear scopes, trade coordination, and construction standards that protect operations from start to finish.
              </p>
            </div>
          </div>
        </section>

        <section id="service-area" className="bg-cream-50 px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <h2 className="text-balance text-3xl font-bold leading-tight tracking-[-0.02em] md:text-5xl">
                Serving Windsor and Northern Colorado.
              </h2>
              <p className="mt-5 text-lg leading-8 text-boulder-500">
                Kiefer Built works across the communities where Northern Colorado families are building, renovating, and planning their next chapter.
              </p>
              <Link
                href="/service-areas"
                className="group mt-7 inline-flex items-center gap-2 rounded-md bg-charcoal-800 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-charcoal-600"
              >
                Explore Service Areas
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {serviceAreas.map((area) => (
                <p
                  key={area}
                  className="rounded-md border border-black/10 bg-cream-100 px-4 py-3 font-semibold transition-colors duration-300 hover:border-black/20"
                >
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
