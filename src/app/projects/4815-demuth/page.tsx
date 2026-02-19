"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

/* ── Photo data ────────────────────────────────────────────────── */
const photos = [
  { src: "/images/project-2/exterior-front-balcony.jpg", alt: "Dark metal siding with cedar post balcony, cable railing, and boulder retaining wall", caption: "Front elevation with covered balcony and boulder wall" },
  { src: "/images/project-2/exterior-front-facade.jpg", alt: "Finished front facade with dark vertical metal siding against pine tree backdrop", caption: "Front facade against Colorado pine forest" },
  { src: "/images/project-2/exterior-wide-property.jpg", alt: "Wide view of finished house and solar shed on mountain property", caption: "Complete property — house and solar outbuilding" },
  { src: "/images/project-2/exterior-driveway-mountains.jpg", alt: "Gravel driveway with boulder accents, solar shed, and mountain vista", caption: "Driveway approach with mountain backdrop" },
  { src: "/images/project-2/exterior-solar-shed.jpg", alt: "Dark metal solar panel shed with covered carport against snowy peaks", caption: "Solar panel outbuilding with mountain views" },
  { src: "/images/project-2/exterior-wide-cloudy.jpg", alt: "Finished house and outbuilding under dramatic cloudy sky", caption: "Property under dramatic Colorado skies" },
  { src: "/images/project-2/exterior-panoramic.jpg", alt: "Panoramic mountain property view with rolling grasslands", caption: "Panoramic mountain property" },
  { src: "/images/project-2/exterior-winter-snow.jpg", alt: "Winter view with snow-covered boulders and dark metal siding", caption: "Winter beauty — snow and steel" },
  { src: "/images/project-2/exterior-winter-detail.jpg", alt: "Winter front siding detail with snow", caption: "Winter siding detail" },
  { src: "/images/project-2/exterior-winter-wide.jpg", alt: "Wide winter view of property with snow-covered landscape", caption: "Winter panorama" },
];

/* ── Project specs ─────────────────────────────────────────────── */
const specs = [
  { label: "Location", value: "Colorado Mountains" },
  { label: "Type", value: "Custom Home + Outbuilding" },
  { label: "Exterior", value: "Dark Metal Panel Siding" },
  { label: "Foundation", value: "ICF (Insulated Concrete Forms)" },
  { label: "Roofing", value: "Standing Seam Metal" },
  { label: "Features", value: "Solar Array, Cedar Posts, Cable Railing" },
  { label: "Landscape", value: "Boulder Retaining Walls, Gravel Drive" },
];

/* ── Build phases ──────────────────────────────────────────────── */
const phases = [
  { name: "Excavation", icon: "⛏️", desc: "Mountain hillside grading and site preparation" },
  { name: "Foundation", icon: "🧱", desc: "ICF insulated concrete form walls for extreme efficiency" },
  { name: "Framing", icon: "🪵", desc: "Two-story structural framing with engineered lumber" },
  { name: "Sheathing", icon: "📐", desc: "OSB wall and roof sheathing for structural integrity" },
  { name: "Weatherproofing", icon: "🛡️", desc: "Typar housewrap, windows, and door installation" },
  { name: "Roofing & Siding", icon: "🏗️", desc: "Standing seam metal roof and dark panel siding" },
  { name: "Finish", icon: "✨", desc: "Cedar posts, cable railing, boulder landscaping" },
];

/* ── Lightbox ──────────────────────────────────────────────────── */
function Lightbox({ photo, onClose, onPrev, onNext }: {
  photo: typeof photos[0];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl z-10 cursor-pointer">‹</button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl z-10 cursor-pointer">›</button>
      <button onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl z-10 cursor-pointer">✕</button>
      <div className="relative w-[90vw] h-[80vh] max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <Image src={photo.src} alt={photo.alt} fill className="object-contain" sizes="90vw" />
        <p className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm">{photo.caption}</p>
      </div>
    </motion.div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function DemuthProject() {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIdx(i);
  const closeLightbox = () => setLightboxIdx(null);
  const prevPhoto = () => setLightboxIdx((i) => i !== null ? (i - 1 + photos.length) % photos.length : null);
  const nextPhoto = () => setLightboxIdx((i) => i !== null ? (i + 1) % photos.length : null);

  return (
    <div ref={containerRef} className="bg-steel-900 min-h-screen">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[3px] bg-pine-400 z-[100]"
        style={{ width: progressWidth }}
      />

      {/* Back nav */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/"
          className="flex items-center gap-2 px-4 py-2 bg-steel-800/80 backdrop-blur-sm rounded-full text-steel-200 hover:text-white text-sm transition-colors border border-steel-700/50">
          ← Back to Portfolio
        </Link>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  HERO                                                      */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[85vh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroParallax }}>
          <Image
            src="/images/project-2/exterior-front-facade.jpg"
            alt="4815 Demuth — finished custom home"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-steel-900/40 via-steel-900/20 to-steel-900" />
        </motion.div>
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 sm:px-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-16 h-1 bg-pine-400 mb-6" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
              4815 Demuth
            </h1>
            <p className="text-steel-200 text-lg sm:text-xl max-w-xl">
              A custom mountain home built from the ground up — dark steel, natural stone, and Colorado pine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  VIDEO                                                     */}
      {/* ════════════════════════════════════════════════════════════ */}
      <SectionWrapper id="timelapse" className="bg-steel-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            tag="The Build"
            title="From the Ground Up"
            desc="Watch a mountain hillside transform into a custom home — excavation through final finish."
          />
          <div className="relative rounded-lg overflow-hidden shadow-2xl border border-steel-700/50">
            <video
              className="w-full aspect-video"
              controls
              poster="/images/project-2/exterior-front-facade.jpg"
              preload="metadata"
            >
              <source src="/images/project-2/build-timelapse.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </SectionWrapper>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  BUILD PHASES                                              */}
      {/* ════════════════════════════════════════════════════════════ */}
      <SectionWrapper id="process" className="bg-steel-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            tag="Process"
            title="Build Phases"
            desc="Every custom home follows a proven path — here's how 4815 Demuth came to life."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.name}
                className="p-5 rounded-lg bg-steel-800 border border-steel-700/40 hover:border-pine-500/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="text-2xl mb-2 block">{phase.icon}</span>
                <h3 className="text-white font-semibold text-sm mb-1">{phase.name}</h3>
                <p className="text-steel-300 text-xs leading-relaxed">{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  SPECS                                                     */}
      {/* ════════════════════════════════════════════════════════════ */}
      <SectionWrapper id="specs" className="bg-pine-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader
            tag="Details"
            title="Project Specifications"
            desc="The materials and methods that make this build stand apart."
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

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  GALLERY                                                   */}
      {/* ════════════════════════════════════════════════════════════ */}
      <SectionWrapper id="gallery" className="bg-steel-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            tag="Gallery"
            title="The Finished Home"
            desc="Dark steel meets mountain landscape — every angle tells a story."
          />

          {/* Hero image */}
          <motion.div
            className="mb-6 rounded-lg overflow-hidden shadow-2xl cursor-pointer border border-steel-700/30"
            whileHover={{ scale: 1.005 }}
            onClick={() => openLightbox(0)}
          >
            <div className="relative aspect-[21/9]">
              <Image
                src={photos[0].src}
                alt={photos[0].alt}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-steel-900/60 to-transparent" />
              <p className="absolute bottom-4 left-6 text-white/90 text-sm font-medium">{photos[0].caption}</p>
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.slice(1).map((photo, i) => (
              <motion.div
                key={photo.src}
                className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border border-steel-700/20 hover:border-pine-500/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                onClick={() => openLightbox(i + 1)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-steel-900/50 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                <p className="absolute bottom-2 left-3 right-3 text-white/0 hover:text-white/90 text-xs transition-colors truncate">{photo.caption}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  CTA                                                       */}
      {/* ════════════════════════════════════════════════════════════ */}
      <SectionWrapper id="cta" className="bg-steel-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-1 bg-pine-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Build Your Dream?
          </h2>
          <p className="text-steel-300 mb-8 max-w-lg mx-auto">
            From mountain retreats to modern farmhouses — we bring your vision to life with precision craftsmanship and premium materials.
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
      <footer className="py-8 bg-steel-900 border-t border-steel-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-steel-500 text-sm">
            © {new Date().getFullYear()} Built by Kiefer. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            photo={photos[lightboxIdx]}
            onClose={closeLightbox}
            onPrev={prevPhoto}
            onNext={nextPhoto}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Reusable section wrapper ──────────────────────────────────── */
function SectionWrapper({ id, className, children }: { id: string; className: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      {children}
    </section>
  );
}

/* ── Reusable section header ───────────────────────────────────── */
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
