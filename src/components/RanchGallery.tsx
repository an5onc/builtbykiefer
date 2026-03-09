"use client";

/**
 * RanchGallery — Parallax Bento Grid with YARL Lightbox
 *
 * Architecture:
 *  • Custom CSS bento grid — each photo gets a pre-assigned span (col × row)
 *    that changes per category filter. First 3 cells are always oversized heroes.
 *  • Per-card mouse parallax — useRef + pointermove tracks cursor position
 *    relative to card bounds; inner image shifts up to ±18px on each axis via
 *    framer-motion useSpring for silky interpolation.
 *  • Scroll reveal — each cell animates in from a direction derived from its
 *    grid position (corners from diagonals, edges from nearest side).
 *  • Category filter — AnimatePresence + layout prop for smooth reflow.
 *  • yet-another-react-lightbox with Zoom, Thumbnails, Captions, Fullscreen.
 */

import { useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  motion,
  useSpring,
  useTransform,
  useMotionValue,
  useInView,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";

/* ── Types ─────────────────────────────────────────────────────── */
export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
  category: string;
};

/* ── Bento span patterns ───────────────────────────────────────── */
// Each entry: [colSpan, rowSpan] — cycles through for each filtered photo
const BENTO_PATTERN: [number, number][] = [
  [2, 2], // hero
  [1, 2], // tall
  [1, 1], // square
  [1, 1], // square
  [2, 1], // wide
  [1, 1], // square
  [1, 1], // square
  [1, 1], // square
  [1, 2], // tall
  [1, 1], // square
  [2, 1], // wide
  [1, 1], // square
];

function getBentoSpan(index: number): [number, number] {
  return BENTO_PATTERN[index % BENTO_PATTERN.length];
}

/* ── Direction for scroll-reveal based on grid position ────────── */
function getRevealDirection(index: number): { x: number; y: number } {
  const col = index % 4;
  if (index < 3) return { x: 0, y: -40 }; // top heroes fall in
  if (col === 0) return { x: -40, y: 0 };
  if (col === 3) return { x: 40, y: 0 };
  return { x: 0, y: 30 };
}

/* ── Per-card mouse parallax hook ──────────────────────────────── */
function useCardParallax(strength = 18) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 22, mass: 0.6 };
  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  const imgX = useTransform(springX, [-1, 1], [-strength, strength]);
  const imgY = useTransform(springY, [-1, 1], [-strength, strength]);
  // Subtle opposite tilt on the card itself
  const tiltX = useTransform(springY, [-1, 1], [4, -4]);
  const tiltY = useTransform(springX, [-1, 1], [-4, 4]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }, [rawX, rawY]);

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { cardRef, imgX, imgY, tiltX, tiltY, onPointerMove, onPointerLeave };
}

/* ── Single bento cell ─────────────────────────────────────────── */
function BentoCell({
  photo,
  index,
  colSpan,
  rowSpan,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  colSpan: number;
  rowSpan: number;
  onOpen: (i: number) => void;
}) {
  const { cardRef, imgX, imgY, tiltX, tiltY, onPointerMove, onPointerLeave } =
    useCardParallax(colSpan === 2 ? 24 : 16);
  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true, margin: "-60px" });
  const { x: dx, y: dy } = getRevealDirection(index);

  const isHero = index === 0;

  return (
    <motion.div
      ref={inViewRef}
      layout
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        transformStyle: "preserve-3d" as const,
        perspective: "900px",
        rotateX: tiltX,
        rotateY: tiltY,
        borderRadius: "16px",
        minHeight: rowSpan === 2 ? "340px" : "200px",
      }}
      initial={{ opacity: 0, x: dx, y: dy, scale: 0.95 }}
      animate={inView ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: Math.min(index * 0.06, 0.5), ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden cursor-pointer group select-none"
    >
      {/* Tappable area */}
      <div
        ref={cardRef}
        className="absolute inset-0"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onClick={() => onOpen(index)}
      >
        {/* Parallax image — slightly oversized so shifts don't show edge */}
        <motion.div
          className="absolute inset-[-24px]"
          style={{ x: imgX, y: imgY }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 50vw, (min-width: 768px) 60vw, 95vw"
            priority={isHero}
            loading={isHero ? "eager" : "lazy"}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(160deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        {/* Hover brighten overlay */}
        <motion.div
          className="absolute inset-0"
          style={{ background: "rgba(255,255,255,0)" }}
          whileHover={{ background: "rgba(255,255,255,0.06)" }}
          transition={{ duration: 0.3 }}
        />

        {/* Category pill — top left */}
        <motion.span
          className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: "rgba(78,148,67,0.85)", color: "white" }}
          initial={{ opacity: 0, y: -6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: Math.min(index * 0.06, 0.5) + 0.25 }}
        >
          {photo.category}
        </motion.span>

        {/* Caption — slides up on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-4 py-3"
          style={{
            background:
              "linear-gradient(to top, rgba(10,15,20,0.85) 0%, transparent 100%)",
          }}
          initial={{ y: "100%" }}
          whileHover={{ y: "0%" }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-white text-xs font-medium truncate">{photo.caption}</p>
          <p className="text-white/50 text-[10px] mt-0.5 uppercase tracking-wider">
            Click to expand
          </p>
        </motion.div>

        {/* Expand icon — top right on hover */}
        <motion.div
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
          initial={{ opacity: 0, scale: 0.7 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Main Gallery Component ────────────────────────────────────── */
const CATEGORIES = ["All", "Exterior", "Aerial", "Kitchen", "Interior"] as const;
type Category = typeof CATEGORIES[number];

export default function RanchGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filtered = useMemo(
    () => (activeCategory === "All" ? photos : photos.filter((p) => p.category === activeCategory)),
    [photos, activeCategory]
  );

  // YARL slides
  const slides = useMemo(
    () => filtered.map((p) => ({ src: p.src, alt: p.alt, title: p.caption, description: p.category })),
    [filtered]
  );

  const handleOpen = useCallback((i: number) => setLightboxIndex(i), []);

  return (
    <section
      id="gallery"
      className="py-20 md:py-28"
      style={{ background: "white" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p
            className="text-sm tracking-[0.35em] uppercase mb-3 font-semibold"
            style={{ color: "var(--color-sage-500)" }}
          >
            Gallery
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "var(--color-slate-800)" }}
          >
            Inside &amp; Out
          </h2>
          <p className="max-w-lg mx-auto" style={{ color: "var(--color-slate-500)" }}>
            29 photos across exterior, aerial, kitchen, and interior.
            Hover any photo — click to explore in full detail.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const count = cat === "All" ? photos.length : photos.filter((p) => p.category === cat).length;
            const active = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative px-5 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-full transition-colors cursor-pointer overflow-hidden"
                style={active
                  ? { background: "var(--color-sage-500)", color: "white", boxShadow: "0 4px 14px rgba(78,148,67,0.3)" }
                  : { background: "var(--color-cream-100)", color: "var(--color-slate-600)", border: "1px solid var(--color-cream-300)" }
                }
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--color-sage-500)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {cat} <span className="opacity-60 font-normal">({count})</span>
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Bento grid */}
        <LayoutGroup>
          <motion.div
            layout
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gridAutoRows: "minmax(180px, auto)",
            }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((photo, i) => {
                const [colSpan, rowSpan] = getBentoSpan(i);
                // Clamp to available columns on smaller grids
                const clampedCol = Math.min(colSpan, 4);
                return (
                  <BentoCell
                    key={photo.src}
                    photo={photo}
                    index={i}
                    colSpan={clampedCol}
                    rowSpan={rowSpan}
                    onOpen={handleOpen}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {/* Photo count */}
        <motion.p
          className="text-center text-xs mt-6 tracking-wider uppercase"
          style={{ color: "var(--color-slate-400)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {filtered.length} of {photos.length} photos
        </motion.p>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[Zoom, Thumbnails, Captions, Fullscreen]}
        zoom={{ maxZoomPixelRatio: 4, scrollToZoom: true }}
        captions={{ showToggle: true, descriptionTextAlign: "center" }}
        thumbnails={{ border: 2, borderStyle: "solid", borderColor: "#4e9443", borderRadius: 6, padding: 3, gap: 8 }}
        styles={{
          container: { backgroundColor: "rgba(10, 12, 16, 0.97)" },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          root: { "--yarl__color_button": "#4e9443", "--yarl__color_button_active": "#6aaf60" } as any,
        }}
        controller={{ closeOnBackdropClick: true }}
        carousel={{ finite: false, preload: 3 }}
        animation={{ swipe: 300 }}
      />

      {/* Responsive grid adjustment */}
      <style>{`
        @media (max-width: 900px) {
          #gallery .grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 560px) {
          #gallery .grid {
            grid-template-columns: repeat(1, 1fr) !important;
          }
          #gallery .grid > * {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
