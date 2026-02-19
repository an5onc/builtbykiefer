"use client";

import Image from "next/image";
import Link from "next/link";
import { LazyMotion, domAnimation, m, AnimatePresence, useInView } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";

/* ── Project data ──────────────────────────────────────────────── */
const projects = [
  {
    id: "project-1",
    title: "Modern Craftsman",
    subtitle: "Custom home with stone accents, walnut cabinetry, and premium finishes",
    location: "Northern Colorado",
    year: "2024",
    href: null, // no dedicated page yet — stays as in-page gallery
    heroImage: "/images/project-1/exterior-1.jpg",
    categories: ["Exterior", "Kitchen", "Interior"] as const,
    images: [
      { src: "/images/project-1/exterior-1.jpg", alt: "Modern craftsman front elevation with covered porch, stone columns, and wood-clad garage doors", category: "Exterior" },
      { src: "/images/project-1/exterior-2.jpg", alt: "Front angle view showcasing three-car garage with cedar doors and white stone accents", category: "Exterior" },
      { src: "/images/project-1/exterior-3.jpg", alt: "Custom walnut front entry door flanked by stone pillar columns and sidelight windows", category: "Exterior" },
      { src: "/images/project-1/exterior-4.jpg", alt: "Rear exterior with covered patio, motorized shade, and board-and-batten siding", category: "Exterior" },
      { src: "/images/project-1/exterior-5.jpg", alt: "Back of home with covered entry, stone columns, and exposed wood beam detail", category: "Exterior" },
      { src: "/images/project-1/exterior-6.jpg", alt: "Side exterior showing multi-gable roofline, stone porch, and mixed siding", category: "Exterior" },
      { src: "/images/project-1/kitchen-1.jpg", alt: "Dark island with marble countertop, walnut cabinetry, and matte black drum pendants", category: "Kitchen" },
      { src: "/images/project-1/kitchen-2.jpg", alt: "Full kitchen with walnut cabinets, slatted ceiling feature, subway tile backsplash, and dark island", category: "Kitchen" },
      { src: "/images/project-1/kitchen-3.jpg", alt: "Wide view of open kitchen with matte black island, marble counters, and walnut perimeter cabinets", category: "Kitchen" },
      { src: "/images/project-1/kitchen-4.jpg", alt: "Gas range detail with walnut cabinetry, dark range hood, and subway tile backsplash", category: "Kitchen" },
      { src: "/images/project-1/kitchen-5.jpg", alt: "Panel-ready refrigerator with custom walnut cabinetry surround", category: "Kitchen" },
      { src: "/images/project-1/kitchen-6.jpg", alt: "Professional double wall oven set in walnut cabinet tower with subway tile", category: "Kitchen" },
      { src: "/images/project-1/kitchen-7.jpg", alt: "Kitchen sink station with matte black faucet, walnut cabinets, and subway tile to ceiling", category: "Kitchen" },
      { src: "/images/project-1/kitchen-8.jpg", alt: "Kitchen opening to dining area with slatted ceiling, dark island, and bubble pendant lights", category: "Kitchen" },
      { src: "/images/project-1/kitchen-9.jpg", alt: "Slatted ceiling detail with matte black drum pendant lights over kitchen island", category: "Kitchen" },
      { src: "/images/project-1/kitchen-10.jpg", alt: "Kitchen from dining perspective showing walnut cabinets, appliances, and natural light", category: "Kitchen" },
      { src: "/images/project-1/interior-1.jpg", alt: "Butler's pantry with dark cabinets, marble countertop, linear tile backsplash, and open shelving", category: "Interior" },
      { src: "/images/project-1/interior-2.jpg", alt: "Laundry room with maple cabinets, marble counter, hexagonal backsplash, and matte black faucet", category: "Interior" },
      { src: "/images/project-1/interior-3.jpg", alt: "Primary bathroom with floating walnut vanity, round wood mirrors, freestanding soaking tub", category: "Interior" },
      { src: "/images/project-1/interior-4.jpg", alt: "Primary bath wide view with dual vanity, glass shower enclosure, and freestanding tub", category: "Interior" },
      { src: "/images/project-1/interior-5.jpg", alt: "Walk-in shower with dual shower heads, hand shower, recessed niche, and mosaic tile floor", category: "Interior" },
      { src: "/images/project-1/interior-6.jpg", alt: "Guest bathroom with decorative blue hexagonal shell tile, maple vanity, and glass shower", category: "Interior" },
      { src: "/images/project-1/interior-7.jpg", alt: "Guest bath shower with blue hexagonal shell tile accent wall and glass door", category: "Interior" },
      { src: "/images/project-1/interior-8.jpg", alt: "Powder room with bold geometric wallpaper, dark vanity, pendant light, and patterned floor tile", category: "Interior" },
      { src: "/images/project-1/interior-9.jpg", alt: "Tub-shower combo with elongated hexagonal tile and glass panel door", category: "Interior" },
      { src: "/images/project-1/interior-10.jpg", alt: "Living room with floor-to-ceiling dark tiled fireplace, linear gas insert, and cable railing staircase", category: "Interior" },
      { src: "/images/project-1/interior-11.jpg", alt: "Primary walk-in shower with dual shower heads, mosaic floor, and recessed storage niche", category: "Interior" },
    ],
  },
  {
    id: "project-2",
    title: "Demuth Residence",
    subtitle: "Mountain custom home — dark steel, boulder walls, and Colorado pine",
    location: "Colorado Mountains",
    year: "2024-2025",
    href: "/projects/demuth-residence",
    heroImage: "/images/project-2/exterior-front-facade.jpg",
    categories: ["Exterior"] as const,
    images: [
      { src: "/images/project-2/exterior-front-balcony.jpg", alt: "Dark metal siding with cedar post balcony, cable railing, and boulder retaining wall", category: "Exterior" },
      { src: "/images/project-2/exterior-front-facade.jpg", alt: "Finished front facade with dark vertical metal siding against pine tree backdrop", category: "Exterior" },
      { src: "/images/project-2/exterior-wide-property.jpg", alt: "Wide view of finished house and solar shed on mountain property", category: "Exterior" },
      { src: "/images/project-2/exterior-driveway-mountains.jpg", alt: "Gravel driveway with boulder accents, solar shed, and mountain vista", category: "Exterior" },
    ],
  },
];

/* ── Page-flip animation variants ──────────────────────────────── */
const pageVariants = {
  enter: (dir: number) => ({
    rotateY: dir > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.95,
  }),
  center: { rotateY: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({
    rotateY: dir < 0 ? 90 : -90,
    opacity: 0,
    scale: 0.95,
  }),
};

const pageTransition = {
  type: "tween" as const,
  duration: 0.45,
  ease: [0.4, 0.0, 0.2, 1] as [number, number, number, number],
};

export default function ProjectGallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [activeProject, setActiveProject] = useState(0);
  const project = projects[activeProject];

  // Category filter for active project
  const allCats = ["All", ...project.categories] as const;
  const [filter, setFilter] = useState<string>("All");
  const [[page, direction], setPage] = useState([0, 0]);

  const filtered = useMemo(() => {
    return filter === "All" ? [...project.images] : project.images.filter((i) => i.category === filter);
  }, [filter, project]);

  const safeIndex = Math.min(page, filtered.length - 1);
  const current = filtered[safeIndex];

  const paginate = useCallback(
    (newDir: number) => {
      setPage(([prev]) => {
        const next = prev + newDir;
        if (next < 0 || next >= filtered.length) return [prev, 0];
        return [next, newDir];
      });
    },
    [filtered.length],
  );

  const jumpTo = useCallback((idx: number) => {
    setPage(([prev]) => [idx, idx > prev ? 1 : -1]);
  }, []);

  const handleProjectChange = useCallback((idx: number) => {
    setActiveProject(idx);
    setFilter("All");
    setPage([0, 0]);
  }, []);

  const handleFilterChange = useCallback((cat: string) => {
    setFilter(cat);
    setPage([0, 0]);
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <section id="projects" className="py-24 md:py-32 bg-charcoal-800" ref={sectionRef as any} aria-labelledby="projects-heading">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6">
          {/* Header */}
          <m.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="text-walnut-400 text-sm tracking-[0.3em] uppercase mb-3">Our Work</p>
            <h2 id="projects-heading" className="text-3xl md:text-4xl font-bold text-sand-100 mb-4">Featured Projects</h2>
            <p className="text-charcoal-200 max-w-lg mx-auto">
              Custom homes built with precision craftsmanship and premium materials.
            </p>
          </m.div>

          {/* ── Project selector cards ────────────────────────────── */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {projects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => handleProjectChange(idx)}
                className={`group relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer ${
                  activeProject === idx
                    ? "ring-2 ring-walnut-500 shadow-lg shadow-walnut-500/20 scale-[1.02]"
                    : "ring-1 ring-charcoal-600 hover:ring-charcoal-400 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="relative w-64 h-36 sm:w-72 sm:h-40">
                  <Image
                    src={proj.heroImage}
                    alt={proj.title}
                    fill
                    className="object-cover"
                    sizes="288px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-sm">{proj.title}</h3>
                    <p className="text-white/60 text-xs">{proj.location} · {proj.year}</p>
                  </div>
                  {proj.href && (
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] bg-walnut-500/90 text-white px-2 py-0.5 rounded-full">
                        Full Story →
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* ── "View Full Project" link if project has dedicated page ── */}
          {project.href && (
            <div className="text-center mb-6">
              <Link
                href={project.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-walnut-600 hover:bg-walnut-500 text-white text-sm font-medium rounded-lg transition-colors shadow-md"
              >
                View Full Project: {project.title}
                <span className="text-walnut-200">→</span>
              </Link>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10" role="group" aria-label="Filter project photos by category">
            {allCats.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                aria-pressed={filter === cat}
                aria-label={`Show ${cat.toLowerCase()} photos`}
                className={`px-4 py-2 text-xs tracking-wider uppercase rounded transition-colors ${
                  filter === cat
                    ? "bg-walnut-500 text-white"
                    : "bg-charcoal-700 text-charcoal-200 hover:bg-charcoal-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Scrapbook ────────────────────────────────────────── */}
          <div className="flex flex-col xl:flex-row gap-6 items-start">
            {/* Main book */}
            <div className="flex-1 w-full min-w-0">
              <div className="relative mx-auto w-full rounded-md overflow-hidden" style={{ perspective: "1400px" }}>
                <div className="relative bg-charcoal-900 border border-charcoal-600 rounded-md shadow-2xl">
                  {/* Spine */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-walnut-700 to-walnut-600 rounded-l-md z-20" />
                  <div className="absolute left-[14px] top-4 bottom-4 w-px bg-walnut-400/30 z-20" />

                  {/* Page area */}
                  <div className="relative aspect-[3/2] m-4 ml-7 bg-charcoal-950 rounded-sm overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                      <m.div
                        key={current?.src ?? "empty"}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={pageTransition}
                        className="absolute inset-0"
                        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                      >
                        {current && (
                          <Image src={current.src} alt={current.alt} fill sizes="(min-width: 1280px) 70vw, 92vw" className="object-cover" priority={safeIndex === 0} />
                        )}
                      </m.div>
                    </AnimatePresence>

                    {/* Nav arrows */}
                    <button
                      onClick={() => paginate(-1)}
                      disabled={safeIndex === 0}
                      className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 z-30 flex items-center justify-center bg-gradient-to-r from-black/50 to-transparent opacity-0 hover:opacity-100 focus:opacity-100 disabled:hidden transition-opacity duration-200 group cursor-pointer"
                      aria-label="Previous page"
                    >
                      <span className="text-white text-4xl sm:text-5xl drop-shadow-lg group-hover:scale-110 transition-transform">&#8249;</span>
                    </button>
                    <button
                      onClick={() => paginate(1)}
                      disabled={safeIndex >= filtered.length - 1}
                      className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 z-30 flex items-center justify-center bg-gradient-to-l from-black/50 to-transparent opacity-0 hover:opacity-100 focus:opacity-100 disabled:hidden transition-opacity duration-200 group cursor-pointer"
                      aria-label="Next page"
                    >
                      <span className="text-white text-4xl sm:text-5xl drop-shadow-lg group-hover:scale-110 transition-transform">&#8250;</span>
                    </button>

                    <div className="pointer-events-none absolute inset-0 shadow-inner rounded-sm" />
                  </div>

                  {/* Bottom bar */}
                  <div className="flex items-center justify-between px-6 sm:px-8 py-5 ml-4">
                    <button
                      onClick={() => paginate(-1)}
                      disabled={safeIndex === 0}
                      className="flex items-center justify-center w-11 h-11 rounded-full bg-charcoal-700 hover:bg-walnut-600 text-sand-100 text-xl disabled:bg-charcoal-800 disabled:text-charcoal-600 disabled:cursor-not-allowed transition-colors shadow-md"
                      aria-label="Previous page"
                    >&#8249;</button>
                    <div className="text-center flex-1 min-w-0 px-4">
                      <p className="text-sand-200 text-sm sm:text-base truncate">{current?.alt}</p>
                      <p className="text-charcoal-400 text-xs mt-1 tracking-wider uppercase">
                        {(current as any)?.category} &middot; {safeIndex + 1} of {filtered.length}
                      </p>
                    </div>
                    <button
                      onClick={() => paginate(1)}
                      disabled={safeIndex >= filtered.length - 1}
                      className="flex items-center justify-center w-11 h-11 rounded-full bg-charcoal-700 hover:bg-walnut-600 text-sand-100 text-xl disabled:bg-charcoal-800 disabled:text-charcoal-600 disabled:cursor-not-allowed transition-colors shadow-md"
                      aria-label="Next page"
                    >&#8250;</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="xl:w-56 w-full flex-shrink-0">
              <p className="text-charcoal-400 text-xs tracking-wider uppercase mb-3 hidden xl:block">Pages</p>
              <div className="flex xl:flex-col flex-row gap-2 overflow-x-auto xl:overflow-y-auto xl:max-h-[600px] pb-2 xl:pb-0 xl:pr-1 scrollbar-thin scrollbar-thumb-charcoal-600">
                {filtered.map((img, idx) => (
                  <button
                    key={img.src}
                    onClick={() => jumpTo(idx)}
                    className={`relative flex-shrink-0 w-24 h-16 xl:w-full xl:h-auto xl:aspect-[4/3] rounded-sm overflow-hidden border-2 transition-all duration-200 ${
                      idx === safeIndex
                        ? "border-walnut-500 shadow-lg shadow-walnut-500/25 opacity-100"
                        : "border-transparent hover:border-charcoal-500 opacity-50 hover:opacity-90"
                    }`}
                  >
                    <Image src={img.src} alt="" fill sizes="160px" className="object-cover" loading="lazy" />
                    <span className={`absolute bottom-1 right-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      idx === safeIndex ? "bg-walnut-500 text-white" : "bg-black/60 text-white/70"
                    }`}>{idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
