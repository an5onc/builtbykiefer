"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

/* ── Photo data ────────────────────────────────────────────────── */
const photos = [
  // Exterior
  { src: "/images/project-3/exterior-twilight-front.jpg", alt: "Contemporary ranch front elevation at twilight — stacked ledgestone columns, dark horizontal wood siding, and arched entry portico with warm soffit lighting", caption: "Front elevation at twilight", category: "Exterior" },
  { src: "/images/project-3/exterior-front-daytime.jpg", alt: "Front elevation daytime view with arched barrel-vault portico, mixed ledgestone and wood siding, circular concrete driveway", caption: "Front elevation — daytime", category: "Exterior" },
  { src: "/images/project-3/exterior-front-angled.jpg", alt: "Angled front elevation showcasing the arched entry portico and layered roofline at twilight", caption: "Front elevation — angled view", category: "Exterior" },
  { src: "/images/project-3/exterior-garage-daytime.jpg", alt: "Garage wing with two dark wood-tone flush-panel doors, stucco and ledgestone accents, generous concrete motor court", caption: "Garage wing — daytime", category: "Exterior" },
  { src: "/images/project-3/exterior-garage-twilight.jpg", alt: "Garage elevation at twilight with modern wall sconces, cantilevered overhangs, and dark garage doors with transom windows", caption: "Garage elevation — twilight", category: "Exterior" },
  { src: "/images/project-3/exterior-entry-portico.jpg", alt: "Front entry portico detail — barrel-vault arch with tongue-and-groove wood ceiling, reeded glass front door, and ledgestone columns", caption: "Entry portico detail", category: "Exterior" },
  { src: "/images/project-3/exterior-entry-close.jpg", alt: "Close-up of the barrel-vault entry vestibule with warm wood plank ceiling, reeded glass front door, and smart lock", caption: "Entry vestibule — close-up", category: "Exterior" },
  // Aerial
  { src: "/images/project-3/aerial-front-twilight.jpg", alt: "Aerial drone view of the full property at twilight showing the complete ranch footprint, circular driveway, and attached garage wing", caption: "Aerial view — full property at twilight", category: "Aerial" },
  { src: "/images/project-3/aerial-front-angle.jpg", alt: "Aerial angled view of the contemporary ranch home showing roof geometry and neighborhood setting", caption: "Aerial — front angle", category: "Aerial" },
  { src: "/images/project-3/aerial-rear-twilight.jpg", alt: "Rear aerial drone shot at twilight showing backyard landscaping, covered patio, and fall foliage surrounding the property", caption: "Rear aerial — twilight with fall foliage", category: "Aerial" },
  // Kitchen
  { src: "/images/project-3/kitchen-overview.jpg", alt: "Open-concept kitchen with dark charcoal island, walnut perimeter cabinetry, white quartz counters, and tray ceiling with cove lighting", caption: "Kitchen — full overview", category: "Kitchen" },
  { src: "/images/project-3/kitchen-island-front.jpg", alt: "Kitchen island front view — dark charcoal cabinetry with white quartz countertop, matte black faucet, and calacatta quartz backsplash wall", caption: "Island front view", category: "Kitchen" },
  { src: "/images/project-3/kitchen-island-sink.jpg", alt: "Kitchen island sink detail with white quartz waterfall countertop, matte black gooseneck faucet, and integrated pop-up electrical outlets", caption: "Island sink and countertop detail", category: "Kitchen" },
  { src: "/images/project-3/kitchen-appliance-wall.jpg", alt: "Kitchen perimeter wall with walnut flat-panel cabinetry, floating wood shelves, built-in double wall ovens, and full-height calacatta quartz backsplash", caption: "Appliance and perimeter wall", category: "Kitchen" },
  { src: "/images/project-3/kitchen-perimeter.jpg", alt: "Kitchen perimeter detail showing walnut cabinetry, quartz countertop, built-in ventilation hood, and floating shelves with LED under-lighting", caption: "Perimeter cabinetry detail", category: "Kitchen" },
  { src: "/images/project-3/kitchen-island-living-view.jpg", alt: "View from kitchen island looking into the great room — stacked stone fireplace, vaulted ceilings, and multi-panel sliding glass doors", caption: "Kitchen to great room view", category: "Kitchen" },
  { src: "/images/project-3/kitchen-dining-view.jpg", alt: "Kitchen and adjacent dining area with walnut cabinetry, white quartz island, and linear chandelier over dining space", caption: "Kitchen and dining area", category: "Kitchen" },
  // Interior
  { src: "/images/project-3/interior-great-room-fireplace.jpg", alt: "Great room with floor-to-ceiling stacked stone fireplace, linear electric insert, vaulted ceilings, and multi-panel sliding glass doors to backyard", caption: "Great room — fireplace wall", category: "Interior" },
  { src: "/images/project-3/interior-great-room-wide.jpg", alt: "Wide-angle great room view showing open-concept layout, vaulted ceilings, stacked stone fireplace, and kitchen beyond", caption: "Great room — wide view", category: "Interior" },
  { src: "/images/project-3/interior-great-room-kitchen.jpg", alt: "Great room and kitchen from the living area — vaulted ceiling, open floor plan, sliding glass doors, and kitchen island visible", caption: "Great room to kitchen", category: "Interior" },
  { src: "/images/project-3/interior-open-plan.jpg", alt: "Full open-concept main floor overview — kitchen, great room, foyer with groin vault ceiling, and cable railing staircase all visible", caption: "Full open-plan overview", category: "Interior" },
  { src: "/images/project-3/interior-living-to-entry.jpg", alt: "Living area looking toward front entry — barrel-vault foyer ceiling, black-framed double glass front doors, and stacked stone fireplace at right", caption: "Living area to entry foyer", category: "Interior" },
  { src: "/images/project-3/interior-dining.jpg", alt: "Dining area with terracotta accent wall, contemporary black linear chandelier, and large windows overlooking the landscaped backyard", caption: "Dining area", category: "Interior" },
  { src: "/images/project-3/interior-primary-bedroom.jpg", alt: "Primary bedroom with vaulted cathedral ceiling, wall of windows, sliding glass patio door to backyard, and neutral plush carpet", caption: "Primary bedroom", category: "Interior" },
  { src: "/images/project-3/interior-primary-bedroom-closets.jpg", alt: "Primary bedroom looking toward ensuite and walk-in closet doorways with black-framed doors and vaulted ceiling", caption: "Primary bedroom — ensuite access", category: "Interior" },
  { src: "/images/project-3/interior-primary-bath.jpg", alt: "Primary bathroom with dual walnut vanity, white quartz countertops, dark slate tile accent wall, oval black-framed mirrors, and matte black fixtures", caption: "Primary bathroom", category: "Interior" },
  { src: "/images/project-3/interior-primary-bath-vanity.jpg", alt: "Primary bath double vanity with warm wood cabinetry, matte black hardware, oval mirrors, and brass cylindrical wall sconces", caption: "Primary bath — vanity detail", category: "Interior" },
  { src: "/images/project-3/interior-master-suite.jpg", alt: "Master suite with integrated laundry nook, freestanding soaking tub, and frameless glass walk-in shower visible through the ensuite doorway", caption: "Master suite — bath and laundry", category: "Interior" },
  { src: "/images/project-3/interior-laundry.jpg", alt: "Laundry room with recessed window niche, white walls, and GE Profile front-load washer with concrete floor drain", caption: "Laundry room", category: "Interior" },
];

/* ── Project specs ─────────────────────────────────────────────── */
const specs = [
  { label: "Location", value: "Northern Colorado" },
  { label: "Type", value: "Spec Home — Contemporary Ranch" },
  { label: "Style", value: "Single-Story Modern Ranch" },
  { label: "Exterior", value: "Ledgestone, Dark Wood Siding, Stucco" },
  { label: "Roofing", value: "Architectural Shingles, Dark Metal Fascia" },
  { label: "Entry", value: "Barrel-Vault Arched Portico" },
  { label: "Kitchen", value: "Two-Tone Cabinetry, Quartz Counters" },
  { label: "Primary Bath", value: "Dual Vanity, Soaking Tub, Frameless Shower" },
  { label: "Great Room", value: "Vaulted Ceilings, Stacked Stone Fireplace" },
  { label: "Outdoor", value: "Covered Patio, Xeriscape Landscaping" },
];

/* ── Build phases ──────────────────────────────────────────────── */
const phases = [
  { name: "Foundation", icon: "🧱", desc: "Poured concrete foundation with engineered floor system" },
  { name: "Framing", icon: "🪵", desc: "Single-story structural framing with vaulted ceiling engineered lumber" },
  { name: "Roofing", icon: "🏗️", desc: "Architectural shingles with dark metal fascia and rain chain details" },
  { name: "Exterior", icon: "🏠", desc: "Ledgestone veneer columns, dark wood plank siding, and smooth stucco" },
  { name: "Windows & Doors", icon: "🪟", desc: "Black-framed windows, multi-panel sliding glass doors, barrel-vault entry" },
  { name: "Interior Finish", icon: "✨", desc: "Custom cabinetry, quartz surfaces, stacked stone fireplace, hardwood floors" },
  { name: "Landscaping", icon: "🌿", desc: "Sod lawn, river rock borders, decorative boulders, ornamental plantings" },
];

const categories = ["All", "Exterior", "Aerial", "Kitchen", "Interior"] as const;
type Category = typeof categories[number];

/* ── Lightbox ──────────────────────────────────────────────────── */
type Photo = { src: string; alt: string; caption: string; category: string };

function Lightbox({ photos, idx, onClose, onPrev, onNext }: {
  photos: Photo[];
  idx: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[idx];
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl z-10 cursor-pointer select-none">‹</button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl z-10 cursor-pointer select-none">›</button>
      <button onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl z-10 cursor-pointer">✕</button>
      <div className="relative w-[92vw] h-[82vh] max-w-7xl" onClick={(e) => e.stopPropagation()}>
        <Image src={photo.src} alt={photo.alt} fill className="object-contain" sizes="92vw" />
        <p className="absolute bottom-3 left-0 right-0 text-center text-white/75 text-sm px-8">{photo.caption}</p>
      </div>
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-wider">{idx + 1} / {photos.length}</p>
    </motion.div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function ContemporaryRanchProject() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered = activeCategory === "All" ? photos : photos.filter(p => p.category === activeCategory);

  const openLightbox = (i: number) => setLightboxIdx(i);
  const closeLightbox = () => setLightboxIdx(null);
  const prevPhoto = () => setLightboxIdx(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null);
  const nextPhoto = () => setLightboxIdx(i => i !== null ? (i + 1) % filtered.length : null);

  return (
    <div ref={containerRef} className="bg-steel-900 min-h-screen">
      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 h-[3px] bg-pine-400 z-[100]" style={{ width: progressWidth }} />

      {/* Back nav */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/"
          className="flex items-center gap-2 px-4 py-2 bg-steel-800/80 backdrop-blur-sm rounded-full text-steel-200 hover:text-white text-sm transition-colors border border-steel-700/50">
          ← Back to Portfolio
        </Link>
      </div>

      {/* ════════ HERO ════════ */}
      <section className="relative h-[85vh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroParallax }}>
          <Image
            src="/images/project-3/exterior-twilight-front.jpg"
            alt="Contemporary ranch front elevation at twilight"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-steel-900/30 via-steel-900/20 to-steel-900" />
        </motion.div>
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 sm:px-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="w-16 h-1 bg-pine-400 mb-6" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
              Contemporary Ranch
            </h1>
            <p className="text-steel-200 text-lg sm:text-xl max-w-xl">
              A Northern Colorado spec home built with premium craftsmanship — stacked stone, dark wood, and open-concept living from the ground up.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════ BUILD PHASES ════════ */}
      <SectionWrapper id="process" className="bg-steel-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            tag="Process"
            title="Build Phases"
            desc="Every detail planned from foundation to final landscaping."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.name}
                className="p-5 rounded-lg bg-steel-800 border border-steel-700/40 hover:border-pine-500/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <span className="text-2xl mb-2 block">{phase.icon}</span>
                <h3 className="text-white font-semibold text-sm mb-1">{phase.name}</h3>
                <p className="text-steel-300 text-xs leading-relaxed">{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ════════ SPECS ════════ */}
      <SectionWrapper id="specs" className="bg-pine-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            tag="Details"
            title="Project Specifications"
            desc="Premium materials and finishes throughout — inside and out."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {specs.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex items-start gap-3 p-4 rounded-lg bg-steel-800/60 border border-pine-800/30"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="w-1 h-full min-h-[2.5rem] bg-pine-500 rounded-full flex-shrink-0" />
                <div>
                  <p className="text-pine-300 text-xs uppercase tracking-wider mb-0.5">{s.label}</p>
                  <p className="text-white text-sm font-medium">{s.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ════════ GALLERY ════════ */}
      <SectionWrapper id="gallery" className="bg-steel-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            tag="Gallery"
            title="Inside & Out"
            desc="29 photos across exterior, aerial, kitchen, and interior — every finish, every detail."
          />

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-10" role="group" aria-label="Filter photos by category">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setLightboxIdx(null); }}
                aria-pressed={activeCategory === cat}
                className={`px-4 py-2 text-xs tracking-wider uppercase rounded transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? "bg-walnut-500 text-white"
                    : "bg-charcoal-700 text-charcoal-200 hover:bg-charcoal-600"
                }`}
              >
                {cat} {cat !== "All" && `(${photos.filter(p => p.category === cat).length})`}
              </button>
            ))}
          </div>

          {/* Hero image */}
          {filtered.length > 0 && (
            <motion.div
              className="mb-4 rounded-lg overflow-hidden shadow-2xl cursor-pointer border border-steel-700/30"
              whileHover={{ scale: 1.003 }}
              onClick={() => openLightbox(0)}
              layout
            >
              <div className="relative aspect-[21/9]">
                <Image
                  src={filtered[0].src}
                  alt={filtered[0].alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-steel-900/60 to-transparent" />
                <p className="absolute bottom-4 left-6 text-white/90 text-sm font-medium">{filtered[0].caption}</p>
                <span className="absolute top-4 right-4 text-[10px] bg-pine-500/90 text-white px-2 py-1 rounded-full uppercase tracking-wider">{filtered[0].category}</span>
              </div>
            </motion.div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.slice(1).map((photo, i) => (
              <motion.div
                key={photo.src}
                className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border border-steel-700/20 hover:border-pine-500/40 transition-colors group"
                whileHover={{ scale: 1.02 }}
                onClick={() => openLightbox(i + 1)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                layout
              >
                <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-steel-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="absolute bottom-2 left-2 right-2 text-white/0 group-hover:text-white/90 text-xs transition-colors truncate">{photo.caption}</p>
                <span className="absolute top-2 right-2 text-[9px] bg-black/50 text-white/70 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">{photo.category}</span>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-steel-400 py-12">No photos in this category.</p>
          )}
        </div>
      </SectionWrapper>

      {/* ════════ CTA ════════ */}
      <SectionWrapper id="cta" className="bg-steel-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-1 bg-pine-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Build?</h2>
          <p className="text-steel-300 mb-8 max-w-lg mx-auto">
            From spec homes to fully custom builds — we bring the same level of precision and quality to every project in Northern Colorado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact"
              className="px-8 py-3 bg-pine-500 hover:bg-pine-400 text-white font-medium rounded-lg transition-colors shadow-lg shadow-pine-500/20">
              Start Your Project
            </Link>
            <Link href="/"
              className="px-8 py-3 bg-steel-700 hover:bg-steel-600 text-steel-200 font-medium rounded-lg transition-colors border border-steel-600">
              View More Projects
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Footer */}
      <footer className="py-8 bg-steel-900 border-t border-steel-700/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-bold tracking-wider text-sm">BUILT BY KIEFER</p>
              <p className="text-steel-400 text-xs tracking-wider mt-1">Custom Homes &middot; Northern Colorado</p>
            </div>
            <nav className="flex gap-6" aria-label="Social links">
              <a href="https://www.facebook.com/KieferBuiltContracting" target="_blank" rel="noopener noreferrer"
                className="text-steel-400 hover:text-pine-400 transition-colors text-sm">Facebook</a>
              <a href="https://www.instagram.com/kieferbuiltco" target="_blank" rel="noopener noreferrer"
                className="text-steel-400 hover:text-pine-400 transition-colors text-sm">Instagram</a>
              <a href="https://kbuiltco.com" target="_blank" rel="noopener noreferrer"
                className="text-steel-400 hover:text-pine-400 transition-colors text-sm">kbuiltco.com</a>
            </nav>
            <div className="text-center md:text-right">
              <p className="text-steel-500 text-xs">&copy; {new Date().getFullYear()} Kiefer Built Contracting. All rights reserved.</p>
              <p className="text-steel-600 text-xs mt-1">
                Created and Powered by{" "}
                <a href="https://nexgenstudio.io" target="_blank" rel="noopener noreferrer"
                  className="text-pine-500/70 hover:text-pine-400 transition-colors">Nexgen Studio</a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox photos={filtered} idx={lightboxIdx} onClose={closeLightbox} onPrev={prevPhoto} onNext={nextPhoto} />
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionWrapper({ id, className, children }: { id: string; className: string; children: React.ReactNode }) {
  return <section id={id} className={`py-20 md:py-28 ${className}`}>{children}</section>;
}

function SectionHeader({ tag, title, desc }: { tag: string; title: string; desc: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className="text-center mb-12"
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <p className="text-pine-400 text-sm tracking-[0.3em] uppercase mb-3">{tag}</p>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
      <p className="text-steel-300 max-w-lg mx-auto">{desc}</p>
    </motion.div>
  );
}
