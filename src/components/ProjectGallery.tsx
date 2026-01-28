"use client";

import Image from "next/image";
import { LazyMotion, domAnimation, m, AnimatePresence, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";

const categories = ["All", "Exterior", "Kitchen", "Interior"] as const;

const images = [
  { src: "/images/project-1/exterior-front-1.jpg", alt: "Modern craftsman exterior front view", category: "Exterior" },
  { src: "/images/project-1/exterior-front-2.jpg", alt: "Two-story modern home with stone accents", category: "Exterior" },
  { src: "/images/project-1/exterior-front-3.jpg", alt: "Custom wood front door with stone columns", category: "Exterior" },
  { src: "/images/project-1/exterior-rear-1.jpg", alt: "Rear exterior with covered patio", category: "Exterior" },
  { src: "/images/project-1/exterior-rear-2.jpg", alt: "Back of home with stone and board-and-batten siding", category: "Exterior" },
  { src: "/images/project-1/exterior-rear-3.jpg", alt: "Entry walkway and front porch", category: "Exterior" },
  { src: "/images/project-1/kitchen-1.jpg", alt: "Custom walnut kitchen with dark island", category: "Kitchen" },
  { src: "/images/project-1/kitchen-2.jpg", alt: "Kitchen marble countertops and pendant lights", category: "Kitchen" },
  { src: "/images/project-1/kitchen-3.jpg", alt: "Open kitchen with walnut cabinets wide view", category: "Kitchen" },
  { src: "/images/project-1/interior-shower.jpg", alt: "Walk-in shower with dual shower heads", category: "Interior" },
] as const;

export default function ProjectGallery() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return filter === "All" ? images : images.filter((i) => i.category === filter);
  }, [filter]);

  return (
    <LazyMotion features={domAnimation} strict>
      <section id="projects" className="py-24 md:py-32 bg-charcoal-800" ref={ref as any}>
        <div className="max-w-7xl mx-auto px-6">
          <m.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="text-walnut-400 text-sm tracking-[0.3em] uppercase mb-3">Our Work</p>
            <h2 className="text-3xl md:text-4xl font-bold text-sand-100 mb-4">Featured Project</h2>
            <p className="text-charcoal-200 max-w-lg mx-auto">
              A modern craftsman home featuring stone accents, custom walnut cabinetry, and premium finishes throughout.
            </p>
          </m.div>

          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
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

          {/* Gallery */}
          <AnimatePresence mode="popLayout" initial={false}>
            <m.div
              key={filter}
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.map((img) => (
                <button
                  key={img.src}
                  type="button"
                  className="relative aspect-[4/3] overflow-hidden rounded-sm text-left group
                             [transform:translateZ(0)] will-change-transform"
                  onClick={() => setLightbox(images.findIndex((x) => x.src === img.src))}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    quality={75}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]
                               [transform:translateZ(0)] will-change-transform"
                  />

                  <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/35 transition-colors duration-200 ease-out flex items-end p-4">
                    <p className="text-white text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 ease-out">
                      {img.alt}
                    </p>
                  </div>
                </button>
              ))}
            </m.div>
          </AnimatePresence>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox !== null && (
            <m.div
              className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
            >
              <button
                className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(null);
                }}
              >
                &times;
              </button>

              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(lightbox === 0 ? images.length - 1 : lightbox - 1);
                }}
              >
                &#8249;
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(lightbox === images.length - 1 ? 0 : lightbox + 1);
                }}
              >
                &#8250;
              </button>

              <div
                className="relative max-h-[85vh] max-w-[90vw] w-[90vw] md:w-[70vw] aspect-[4/3]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[lightbox].src}
                  alt={images[lightbox].alt}
                  fill
                  sizes="90vw"
                  quality={85}
                  className="object-contain"
                  priority
                />
              </div>

              <p className="absolute bottom-6 text-sand-300 text-sm tracking-wide px-6 text-center">
                {images[lightbox].alt}
              </p>
            </m.div>
          )}
        </AnimatePresence>
      </section>
    </LazyMotion>
  );
}