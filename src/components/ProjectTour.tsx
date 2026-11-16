"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RanchGallery, { type GalleryPhoto } from "@/components/RanchGallery";
import { businessContact } from "@/lib/public-site/business";

/* ── Main Page ─────────────────────────────────────────────────── */
export type ProjectTourContent = {
  title: string;
  description: string;
  hero: { src: string; alt: string };
  photos: GalleryPhoto[];
  ctaTitle?: string;
  ctaDescription?: string;
  backHref?: string;
  moreHref?: string;
  galleryCategories?: readonly string[];
  galleryTitle?: string;
  galleryDescription?: string;
  theme?: CSSProperties;
  surfaceRgb?: string;
  accent?: string;
  accentHighlight?: string;
};

export default function ProjectTour({
  title, description, hero, photos,
  ctaTitle = "Ready to Build?",
  ctaDescription = "From spec homes to fully custom builds — we bring the same level of precision and quality to every project in Northern Colorado.",
  backHref = "/", moreHref = "/", galleryCategories, galleryTitle, galleryDescription,
  theme, surfaceRgb = "253,252,249", accent, accentHighlight,
}: ProjectTourContent) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  return (
    <div ref={containerRef} className="relative min-h-screen" style={{ ...theme, background: "var(--color-cream-50)" }}>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[3px] z-[100]"
        style={{ width: progressWidth, background: "var(--color-sage-400)" }}
      />

      {/* Back nav */}
      <div className="fixed top-4 left-4 z-50">
        <Link href={backHref}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm border"
          style={{
            background: `rgba(${surfaceRgb},0.90)`,
            backdropFilter: "blur(8px)",
            color: "var(--color-slate-700)",
            borderColor: "var(--color-cream-300)"
          }}>
          ← Back to Portfolio
        </Link>
      </div>

      <main id="main-content">
      {/* ════════ HERO ════════ */}
      <section data-project-tour-hero className="relative h-[78svh] min-h-[36rem] overflow-hidden sm:min-h-[38rem]">
        <motion.div className="absolute inset-0" style={{ y: heroParallax }}>
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 767px) max(100vw, 150vh), 100vw"
          />
        </motion.div>
        {/* Keep daylight photography clear; the cream transition lives at the edge. */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, transparent 50%), linear-gradient(to bottom, rgba(${surfaceRgb},0) 70%, rgba(${surfaceRgb},0.10) 84%, rgba(${surfaceRgb},0.52) 95%, rgb(${surfaceRgb}) 100%)`
        }} />
        <div className="relative z-10 h-full flex flex-col justify-end pb-8 px-4 sm:pb-10 sm:px-12 max-w-7xl mx-auto">
          <motion.div
            className="w-full max-w-2xl rounded-2xl border border-white/15 p-5 shadow-lg sm:p-6"
            style={{ background: "linear-gradient(110deg, rgba(24,28,28,0.76), rgba(24,28,28,0.64))", backdropFilter: "blur(4px)" }}
            initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-12 h-1 mb-4 rounded-full" style={{ background: "var(--color-sage-400)" }} />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 tracking-tight text-white">
              {title}
            </h1>
            <p className="text-base sm:text-lg max-w-xl text-white/95">
              {description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════ GALLERY ════════ */}
      <RanchGallery photos={photos} categories={galleryCategories} title={galleryTitle} description={galleryDescription} accent={accent} accentHighlight={accentHighlight} />

      {/* ════════ CTA ════════ */}
      <SectionWrapper id="cta" bg="var(--color-cream-100)">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-1 mx-auto mb-6 rounded-full" style={{ background: "var(--color-sage-400)" }} />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--color-slate-800)" }}>
            {ctaTitle}
          </h2>
          <p className="mb-8 max-w-lg mx-auto" style={{ color: "var(--color-slate-600)" }}>
            {ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact"
              className="px-8 py-3 font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-white"
              style={{ background: "var(--color-sage-600)" }}>
              Start Your Project
            </Link>
            <Link href={moreHref}
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
      </main>

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
                { label: "Facebook", href: businessContact.facebook },
                { label: "Instagram", href: businessContact.instagram },
              ].map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: "var(--color-slate-500)" }}>
                  {link.label}
                </a>
              ))}
              <Link href="/" className="text-sm transition-colors hover:underline"
                style={{ color: "var(--color-slate-500)" }}>kbuiltco.com</Link>
            </nav>
            <div className="text-center md:text-right">
              <p className="text-xs" style={{ color: "var(--color-slate-600)" }}>
                &copy; {new Date().getFullYear()} Kiefer Built Contracting. All rights reserved.
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-slate-600)" }}>
                Created and Powered by{" "}
                <a href="https://nexgenstudio.io" target="_blank" rel="noopener noreferrer"
                  className="underline decoration-current/60 underline-offset-2 transition-colors hover:no-underline" style={{ color: "var(--color-sage-700)" }}>
                  Nexgen Studio
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

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
