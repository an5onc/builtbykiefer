"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

/* ── Types ─────────────────────────────────────────────────────── */
type Photo = { src: string; alt: string; caption: string; category: string };

/* ── Photo data ────────────────────────────────────────────────── */
const photos: Photo[] = [
  // Exterior
  { src: "/images/project-3/exterior-twilight-front.jpg", alt: "Contemporary ranch front elevation at twilight — stacked ledgestone columns, dark horizontal wood siding, arched entry portico with warm soffit lighting", caption: "Front elevation at twilight", category: "Exterior" },
  { src: "/images/project-3/exterior-front-daytime.jpg", alt: "Front elevation daytime — barrel-vault portico, mixed ledgestone and wood siding, circular concrete driveway", caption: "Front elevation — daytime", category: "Exterior" },
  { src: "/images/project-3/exterior-front-angled.jpg", alt: "Angled front elevation — arched entry portico and layered roofline at twilight", caption: "Front elevation — angled view", category: "Exterior" },
  { src: "/images/project-3/exterior-garage-daytime.jpg", alt: "Garage wing with dark wood-tone flush-panel doors, stucco and ledgestone accents, concrete motor court", caption: "Garage wing — daytime", category: "Exterior" },
  { src: "/images/project-3/exterior-garage-twilight.jpg", alt: "Garage elevation at twilight with modern wall sconces, cantilevered overhangs, and dark garage doors", caption: "Garage elevation — twilight", category: "Exterior" },
  { src: "/images/project-3/exterior-entry-portico.jpg", alt: "Front entry portico — barrel-vault arch with tongue-and-groove wood ceiling, reeded glass front door, ledgestone columns", caption: "Entry portico detail", category: "Exterior" },
  { src: "/images/project-3/exterior-entry-close.jpg", alt: "Barrel-vault entry vestibule with warm wood plank ceiling, reeded glass front door, and smart lock", caption: "Entry vestibule — close-up", category: "Exterior" },
  // Aerial
  { src: "/images/project-3/aerial-front-twilight.jpg", alt: "Aerial drone view at twilight — full ranch footprint, circular driveway, attached garage wing", caption: "Aerial — full property at twilight", category: "Aerial" },
  { src: "/images/project-3/aerial-front-angle.jpg", alt: "Aerial angled view showing roof geometry and neighborhood setting", caption: "Aerial — front angle", category: "Aerial" },
  { src: "/images/project-3/aerial-rear-twilight.jpg", alt: "Rear aerial at twilight — backyard landscaping, covered patio, and fall foliage surrounding the property", caption: "Aerial — rear at twilight", category: "Aerial" },
  // Kitchen
  { src: "/images/project-3/kitchen-overview.jpg", alt: "Open-concept kitchen with dark charcoal island, walnut perimeter cabinetry, white quartz counters, tray ceiling with cove lighting", caption: "Kitchen — full overview", category: "Kitchen" },
  { src: "/images/project-3/kitchen-island-front.jpg", alt: "Kitchen island — dark charcoal cabinetry, white quartz countertop, matte black faucet, calacatta quartz backsplash", caption: "Island front view", category: "Kitchen" },
  { src: "/images/project-3/kitchen-island-sink.jpg", alt: "Island sink detail — white quartz waterfall countertop, matte black faucet, integrated pop-up electrical outlets", caption: "Island sink and countertop detail", category: "Kitchen" },
  { src: "/images/project-3/kitchen-appliance-wall.jpg", alt: "Appliance wall — walnut flat-panel cabinetry, floating wood shelves, double wall ovens, full-height calacatta backsplash", caption: "Appliance and perimeter wall", category: "Kitchen" },
  { src: "/images/project-3/kitchen-perimeter.jpg", alt: "Perimeter cabinetry — walnut cabinets, quartz countertop, built-in ventilation hood, floating shelves with LED lighting", caption: "Perimeter cabinetry detail", category: "Kitchen" },
  { src: "/images/project-3/kitchen-island-living-view.jpg", alt: "View from kitchen island into the great room — stacked stone fireplace, vaulted ceilings, sliding glass doors", caption: "Kitchen to great room view", category: "Kitchen" },
  { src: "/images/project-3/kitchen-dining-view.jpg", alt: "Kitchen and adjacent dining with walnut cabinetry, white quartz island, and linear chandelier", caption: "Kitchen and dining area", category: "Kitchen" },
  // Interior
  { src: "/images/project-3/interior-great-room-fireplace.jpg", alt: "Great room — floor-to-ceiling stacked stone fireplace, linear electric insert, vaulted ceilings, multi-panel sliding glass doors", caption: "Great room — fireplace wall", category: "Interior" },
  { src: "/images/project-3/interior-great-room-wide.jpg", alt: "Great room wide view — open-concept layout, vaulted ceilings, stacked stone fireplace, kitchen beyond", caption: "Great room — wide view", category: "Interior" },
  { src: "/images/project-3/interior-great-room-kitchen.jpg", alt: "Great room to kitchen — vaulted ceiling, open floor plan, sliding glass doors, kitchen island visible", caption: "Great room to kitchen", category: "Interior" },
  { src: "/images/project-3/interior-open-plan.jpg", alt: "Full open-concept main floor — kitchen, great room, groin vault foyer, and cable railing staircase all visible", caption: "Full open-plan overview", category: "Interior" },
  { src: "/images/project-3/interior-living-to-entry.jpg", alt: "Living area toward front entry — barrel-vault foyer, black-framed double glass doors, stacked stone fireplace at right", caption: "Living area to entry foyer", category: "Interior" },
  { src: "/images/project-3/interior-dining.jpg", alt: "Dining area — terracotta accent wall, contemporary black linear chandelier, large windows to landscaped backyard", caption: "Dining area", category: "Interior" },
  { src: "/images/project-3/interior-primary-bedroom.jpg", alt: "Primary bedroom — vaulted cathedral ceiling, wall of windows, sliding glass patio door to backyard, neutral plush carpet", caption: "Primary bedroom", category: "Interior" },
  { src: "/images/project-3/interior-primary-bedroom-closets.jpg", alt: "Primary bedroom toward ensuite and walk-in closet — black-framed doors, vaulted ceiling", caption: "Primary bedroom — ensuite access", category: "Interior" },
  { src: "/images/project-3/interior-primary-bath.jpg", alt: "Primary bathroom — dual walnut vanity, white quartz countertops, dark slate tile accent wall, oval black-framed mirrors", caption: "Primary bathroom", category: "Interior" },
  { src: "/images/project-3/interior-primary-bath-vanity.jpg", alt: "Primary bath vanity detail — warm wood cabinetry, matte black hardware, oval mirrors, brass cylindrical wall sconces", caption: "Primary bath — vanity detail", category: "Interior" },
  { src: "/images/project-3/interior-master-suite.jpg", alt: "Master suite — integrated laundry nook, freestanding soaking tub, and frameless glass walk-in shower", caption: "Master suite — bath and laundry", category: "Interior" },
  { src: "/images/project-3/interior-laundry.jpg", alt: "Laundry room — recessed window niche, white walls, GE Profile front-load washer", caption: "Laundry room", category: "Interior" },
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
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
    <div ref={containerRef} className="min-h-screen" style={{ background: "var(--color-cream-50)" }}>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[3px] z-[100]"
        style={{ width: progressWidth, background: "var(--color-sage-400)" }}
      />

      {/* Back nav */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm border"
          style={{
            background: "rgba(253,252,249,0.90)",
            backdropFilter: "blur(8px)",
            color: "var(--color-slate-700)",
            borderColor: "var(--color-cream-300)"
          }}>
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
          {/* Light gradient — warm cream at bottom, clear at top */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(253,252,249,0.92) 100%)"
          }} />
        </motion.div>
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 sm:px-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="w-16 h-1 mb-6 rounded-full" style={{ background: "var(--color-sage-400)" }} />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 tracking-tight" style={{ color: "var(--color-slate-800)" }}>
              Contemporary Ranch
            </h1>
            <p className="text-lg sm:text-xl max-w-xl" style={{ color: "var(--color-slate-600)" }}>
              A Northern Colorado spec home built with premium craftsmanship — stacked stone, warm wood, and open-concept living from the ground up.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════ BUILD PHASES ════════ */}
      <SectionWrapper id="process" bg="var(--color-cream-50)">
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
                className="p-5 rounded-xl shadow-sm border transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  background: "white",
                  borderColor: "var(--color-cream-300)"
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <span className="text-2xl mb-3 block">{phase.icon}</span>
                <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--color-slate-800)" }}>{phase.name}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-slate-500)" }}>{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ════════ SPECS ════════ */}
      <SectionWrapper id="specs" bg="var(--color-sage-50)">
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
                className="flex items-start gap-3 p-4 rounded-xl border shadow-sm"
                style={{
                  background: "white",
                  borderColor: "var(--color-sage-200)"
                }}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="w-1 h-full min-h-[2.5rem] rounded-full flex-shrink-0" style={{ background: "var(--color-sage-400)" }} />
                <div>
                  <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "var(--color-sage-600)" }}>{s.label}</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-slate-800)" }}>{s.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ════════ GALLERY ════════ */}
      <SectionWrapper id="gallery" bg="white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            tag="Gallery"
            title="Inside & Out"
            desc="29 photos across exterior, aerial, kitchen, and interior — every finish, every detail."
          />

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10" role="group" aria-label="Filter photos by category">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setLightboxIdx(null); }}
                aria-pressed={activeCategory === cat}
                className="px-4 py-2 text-xs tracking-wider uppercase rounded-full font-medium transition-all cursor-pointer"
                style={activeCategory === cat ? {
                  background: "var(--color-sage-500)",
                  color: "white",
                  boxShadow: "0 2px 8px rgba(78,148,67,0.25)"
                } : {
                  background: "var(--color-cream-100)",
                  color: "var(--color-slate-600)",
                  border: "1px solid var(--color-cream-300)"
                }}
              >
                {cat} {cat !== "All" && `(${photos.filter(p => p.category === cat).length})`}
              </button>
            ))}
          </div>

          {/* Hero image */}
          {filtered.length > 0 && (
            <motion.div
              className="mb-4 rounded-2xl overflow-hidden shadow-lg cursor-pointer border"
              style={{ borderColor: "var(--color-cream-200)" }}
              whileHover={{ scale: 1.003 }}
              onClick={() => openLightbox(0)}
              layout
            >
              <div className="relative aspect-[21/9]">
                <Image src={filtered[0].src} alt={filtered[0].alt} fill className="object-cover" sizes="100vw" priority />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(14,21,30,0.55) 0%, transparent 50%)" }} />
                <p className="absolute bottom-4 left-6 text-white/90 text-sm font-medium">{filtered[0].caption}</p>
                <span className="absolute top-4 right-4 text-[10px] px-2.5 py-1 rounded-full font-medium uppercase tracking-wider"
                  style={{ background: "var(--color-sage-500)", color: "white" }}>
                  {filtered[0].category}
                </span>
              </div>
            </motion.div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.slice(1).map((photo, i) => (
              <motion.div
                key={photo.src}
                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border group shadow-sm hover:shadow-md transition-all"
                style={{ borderColor: "var(--color-cream-200)" }}
                whileHover={{ scale: 1.02 }}
                onClick={() => openLightbox(i + 1)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                layout
              >
                <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" loading="lazy" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(to top, rgba(14,21,30,0.65) 0%, transparent 60%)" }} />
                <p className="absolute bottom-2 left-2 right-2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate text-white/90">{photo.caption}</p>
                <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider font-medium"
                  style={{ background: "rgba(78,148,67,0.85)", color: "white" }}>
                  {photo.category}
                </span>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center py-12" style={{ color: "var(--color-slate-400)" }}>No photos in this category.</p>
          )}
        </div>
      </SectionWrapper>

      {/* ════════ CTA ════════ */}
      <SectionWrapper id="cta" bg="var(--color-cream-100)">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-1 mx-auto mb-6 rounded-full" style={{ background: "var(--color-sage-400)" }} />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--color-slate-800)" }}>
            Ready to Build?
          </h2>
          <p className="mb-8 max-w-lg mx-auto" style={{ color: "var(--color-slate-600)" }}>
            From spec homes to fully custom builds — we bring the same level of precision and quality to every project in Northern Colorado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact"
              className="px-8 py-3 font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-white"
              style={{ background: "var(--color-sage-500)" }}>
              Start Your Project
            </Link>
            <Link href="/"
              className="px-8 py-3 font-medium rounded-xl transition-all border hover:-translate-y-0.5"
              style={{
                background: "white",
                color: "var(--color-slate-700)",
                borderColor: "var(--color-cream-300)"
              }}>
              View More Projects
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Footer */}
      <footer className="py-8 border-t" style={{ background: "var(--color-cream-100)", borderColor: "var(--color-cream-300)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-bold tracking-wider text-sm" style={{ color: "var(--color-slate-800)" }}>BUILT BY KIEFER</p>
              <p className="text-xs tracking-wider mt-1" style={{ color: "var(--color-slate-500)" }}>Custom Homes · Northern Colorado</p>
            </div>
            <nav className="flex gap-6" aria-label="Social links">
              {[
                { label: "Facebook", href: "https://www.facebook.com/KieferBuiltContracting" },
                { label: "Instagram", href: "https://www.instagram.com/kieferbuiltco" },
                { label: "kbuiltco.com", href: "https://kbuiltco.com" },
              ].map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: "var(--color-slate-500)" }}>
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="text-center md:text-right">
              <p className="text-xs" style={{ color: "var(--color-slate-400)" }}>
                &copy; {new Date().getFullYear()} Kiefer Built Contracting. All rights reserved.
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-slate-300)" }}>
                Created and Powered by{" "}
                <a href="https://nexgenstudio.io" target="_blank" rel="noopener noreferrer"
                  className="transition-colors hover:underline" style={{ color: "var(--color-sage-500)" }}>
                  Nexgen Studio
                </a>
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

/* ── Reusable helpers ──────────────────────────────────────────── */
function SectionWrapper({ id, bg, children }: { id: string; bg: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-20 md:py-28" style={{ background: bg }}>
      {children}
    </section>
  );
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
      <p className="text-sm tracking-[0.3em] uppercase mb-3 font-medium" style={{ color: "var(--color-sage-500)" }}>{tag}</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--color-slate-800)" }}>{title}</h2>
      <p className="max-w-lg mx-auto" style={{ color: "var(--color-slate-500)" }}>{desc}</p>
    </motion.div>
  );
}
