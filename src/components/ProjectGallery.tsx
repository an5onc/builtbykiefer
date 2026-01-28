"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const categories = ["All", "Exterior", "Kitchen", "Interior"];

const images = [
  {
    src: "/images/project-1/exterior-front-1.jpg",
    alt: "Modern craftsman exterior front view",
    category: "Exterior",
    span: "col-span-2 row-span-2",
  },
  {
    src: "/images/project-1/kitchen-1.jpg",
    alt: "Custom walnut kitchen with dark island",
    category: "Kitchen",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/project-1/exterior-front-2.jpg",
    alt: "Two-story modern home with stone accents",
    category: "Exterior",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/project-1/kitchen-2.jpg",
    alt: "Kitchen marble countertops and pendant lights",
    category: "Kitchen",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/project-1/front-door.jpg",
    alt: "Custom wood front door with stone columns",
    category: "Exterior",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/project-1/kitchen-3.jpg",
    alt: "Open kitchen with walnut cabinets wide view",
    category: "Kitchen",
    span: "col-span-2 row-span-1",
  },
  {
    src: "/images/project-1/shower.jpg",
    alt: "Walk-in shower with dual shower heads",
    category: "Interior",
    span: "col-span-1 row-span-2",
  },
  {
    src: "/images/project-1/exterior-back.jpg",
    alt: "Rear exterior with covered patio",
    category: "Exterior",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/project-1/exterior-rear.jpg",
    alt: "Back of home with stone and board-and-batten siding",
    category: "Exterior",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/project-1/exterior-entry.jpg",
    alt: "Entry walkway and front porch",
    category: "Exterior",
    span: "col-span-1 row-span-1",
  },
];

export default function ProjectGallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    filter === "All" ? images : images.filter((i) => i.category === filter);

  return (
    <section
      id="projects"
      className="py-24 md:py-32 bg-charcoal-800"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-walnut-400 text-sm tracking-[0.3em] uppercase mb-3">
            Our Work
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-sand-100 mb-4">
            Featured Project
          </h2>
          <p className="text-charcoal-200 max-w-lg mx-auto">
            A modern craftsman home featuring stone accents, custom walnut
            cabinetry, and premium finishes throughout.
          </p>
        </motion.div>

        {/* Filter buttons */}
        <div className="flex justify-center gap-3 mb-10">
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

        {/* Gallery grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px] md:auto-rows-[250px]"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div
                key={img.src}
                className={`${img.span} relative overflow-hidden rounded-sm cursor-pointer group`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() =>
                  setLightbox(images.findIndex((x) => x.src === img.src))
                }
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/40 transition-colors duration-300 flex items-end p-4">
                  <p className="text-white text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {img.alt}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl"
              onClick={() => setLightbox(null)}
            >
              &times;
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl px-3"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(
                  lightbox === 0 ? images.length - 1 : lightbox - 1
                );
              }}
            >
              &#8249;
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl px-3"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(
                  lightbox === images.length - 1 ? 0 : lightbox + 1
                );
              }}
            >
              &#8250;
            </button>
            <motion.img
              key={images[lightbox].src}
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            />
            <p className="absolute bottom-6 text-sand-300 text-sm tracking-wide">
              {images[lightbox].alt}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
