"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

import Lightbox from "@/components/ProjectLightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { businessContact } from "@/lib/public-site/business";
import { mountainVideo } from "@/lib/public-site/project-video";

/* ── Photo data ────────────────────────────────────────────────── */
const photos = [
  { src: "/images/project-2/exterior-front-balcony.jpg", alt: "Dark metal siding with cedar post balcony, cable railing, and boulder retaining wall", caption: "Front elevation with covered balcony and boulder wall" },
  { src: "/images/project-2/exterior-front-facade.jpg", alt: "Finished front facade with dark vertical metal siding against pine tree backdrop", caption: "Front facade against Colorado pine forest" },
  { src: "/images/project-2/exterior-wide-property.jpg", alt: "Wide view of finished house and solar shed on mountain property", caption: "Complete property — house and solar outbuilding" },
  { src: "/images/project-2/exterior-driveway-mountains.jpg", alt: "Gravel driveway with boulder accents, solar shed, and mountain vista", caption: "Driveway approach with mountain backdrop" },
  { src: "/images/project-2/exterior-wide-cloudy.jpg", alt: "Finished house and outbuilding under dramatic cloudy sky", caption: "Property under dramatic Colorado skies" },
  { src: "/images/project-2/exterior-panoramic.jpg", alt: "Panoramic mountain property view with rolling grasslands", caption: "Panoramic mountain property" },
  // Original winter filenames are preserved; these are snow-free build-progress photos.
  { src: "/images/project-2/exterior-winter-snow.jpg", alt: "ICF foundation walls with exposed floor framing on the mountain site", caption: "Foundation walls and floor framing" },
  { src: "/images/project-2/exterior-winter-detail.jpg", alt: "Floor framing across ICF foundation walls with construction equipment in the background", caption: "Foundation and framing detail" },
  { src: "/images/project-2/exterior-winter-wide.jpg", alt: "Wide view of the foundation and floor framing beside a telehandler on the mountain site", caption: "Mountain site — foundation stage" },
];

/* ── Main Page ─────────────────────────────────────────────────── */
export default function MountainModernProject() {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIdx(i);
  const closeLightbox = () => setLightboxIdx(null);

  return (
    <main id="main-content" ref={containerRef} className="bg-steel-900 min-h-screen">
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
            alt="Mountain Modern — finished custom home"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-steel-900/40 via-steel-900/20 to-steel-900" />
        </motion.div>
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 sm:px-12 max-w-7xl mx-auto">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-16 h-1 bg-pine-400 mb-6" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
              Mountain Modern
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
              aria-label="Mountain Modern construction slideshow"
              aria-describedby="build-video-description build-video-audio"
              className="w-full aspect-video"
              controls
              poster="/images/project-2/exterior-front-facade.jpg"
              preload="metadata"
            >
              <source src={mountainVideo.source} type="video/mp4" />
              <track kind="captions" src={mountainVideo.captions} srcLang="en" label="English — background music" default />
              <track kind="descriptions" src={mountainVideo.descriptions} srcLang="en" label="English — visual descriptions" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p id="build-video-description" className="mt-4 text-sm leading-6 text-white/75">
            Video description: a short slideshow follows excavation, foundation work, wall and roof installation,
            weatherproofing, and the finished mountain home and solar outbuilding.
          </p>
          <p id="build-video-audio" className="mt-2 text-sm leading-6 text-white/75">
            Audio: background music only; no narration.
          </p>
          <details className="mt-4 rounded-lg border border-white/20 p-4 text-sm leading-6 text-white/90">
            <summary className="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              Read the video transcript
            </summary>
            <p className="mt-4">Background music accompanies the slideshow throughout. The construction stages and on-screen labels are described below.</p>
            <ol className="mt-3 space-y-2">
              {mountainVideo.transcript.map((cue) => (
                <li key={cue.start}><span className="font-semibold">{cue.time}: </span>{cue.text}</li>
              ))}
            </ol>
          </details>
        </div>
      </SectionWrapper>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  GALLERY                                                   */}
      {/* ════════════════════════════════════════════════════════════ */}
      <SectionWrapper id="gallery" className="bg-steel-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            tag="Gallery"
            title="From Foundation to Finished Home"
            desc="Explore the completed mountain home alongside foundation and framing progress."
          />

          {/* Hero image */}
          <motion.button
            type="button"
            aria-label={`Open photo: ${photos[0].caption}`}
            className="block w-full mb-6 rounded-lg overflow-hidden shadow-2xl cursor-pointer border border-steel-700/30"
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
          </motion.button>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.slice(1).map((photo, i) => (
              <motion.button
                type="button"
                aria-label={`Open photo: ${photo.caption}`}
                key={photo.src}
                className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border border-steel-700/20 hover:border-pine-500/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                onClick={() => openLightbox(i + 1)}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px 200px 0px" }}
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
              </motion.button>
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
          <p className="text-steel-200 mb-8 max-w-lg mx-auto">
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

      {/* EPS Partnership */}
      <section className="py-16 bg-steel-800 border-t border-steel-700/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-pine-500/50" />
              <span className="text-pine-200 text-xs tracking-[0.3em] uppercase">
                Built in Partnership
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-pine-500/50" />
            </div>
            <div className="flex items-center justify-center gap-8 md:gap-12">
              <Link
                href="/"
                className="flex flex-col items-center group"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 relative transition-transform group-hover:scale-105">
                  <Image
                    src="/images/kiefer-k-logo.png"
                    alt="Kiefer Built Contracting"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="mt-2 text-steel-200 text-xs tracking-wider group-hover:text-pine-200 transition-colors">
                  KIEFER BUILT
                </span>
              </Link>
              <div className="text-pine-500/60 text-2xl font-light">+</div>
              <a
                href="https://epsbuildings.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group"
              >
                <div className="w-24 h-16 md:w-32 md:h-20 relative transition-transform group-hover:scale-105">
                  <Image
                    src="/images/eps-buildings-logo.webp"
                    alt="EPS Buildings"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="mt-2 text-steel-200 text-xs tracking-wider group-hover:text-pine-200 transition-colors">
                  EPS BUILDINGS
                </span>
              </a>
            </div>
            <p className="mt-8 text-steel-200 text-sm max-w-lg mx-auto leading-relaxed">
              Two industry leaders combining expertise to deliver exceptional custom homes
              with innovative building solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-steel-900 border-t border-steel-700/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-bold tracking-wider text-sm">BUILT BY KIEFER</p>
              <p className="text-steel-200 text-xs tracking-wider mt-1">Custom Homes &middot; Northern Colorado</p>
            </div>
            <nav className="flex gap-6" aria-label="Social links">
              <a href={businessContact.facebook} target="_blank" rel="noopener noreferrer"
                className="text-steel-200 hover:text-pine-200 transition-colors text-sm">Facebook</a>
              <a href={businessContact.instagram} target="_blank" rel="noopener noreferrer"
                className="text-steel-200 hover:text-pine-200 transition-colors text-sm">Instagram</a>
              <Link href="/"
                className="text-steel-200 hover:text-pine-200 transition-colors text-sm">kbuiltco.com</Link>
            </nav>
            <div className="text-center md:text-right">
              <p className="text-steel-200 text-xs">
                &copy; {new Date().getFullYear()} Kiefer Built Contracting. All rights reserved.
              </p>
              <p className="text-steel-200 text-xs mt-1">
                Created and Powered by{" "}
                <a href="https://nexgenstudio.io" target="_blank" rel="noopener noreferrer"
                  className="text-pine-200 underline underline-offset-4 hover:text-white transition-colors">Nexgen Studio</a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIdx !== null}
        index={lightboxIdx ?? 0}
        close={closeLightbox}
        slides={photos.map((photo) => ({ src: photo.src, alt: photo.alt, description: photo.caption }))}
        plugins={[Captions]}
        captions={{ descriptionTextAlign: "center" }}
        controller={{ closeOnBackdropClick: true }}
        carousel={{ preload: 2 }}
      />
    </main>
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
  const inView = useInView(ref, { once: true, margin: "0px 0px 200px 0px" });
  return (
    <motion.div
      ref={ref}
      className="text-center mb-12"
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <p className="text-pine-200 text-sm tracking-[0.3em] uppercase mb-3">{tag}</p>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
      <p className="text-steel-200 max-w-lg mx-auto">{desc}</p>
    </motion.div>
  );
}
