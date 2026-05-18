"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const HERO_IMAGE = "/images/project-3/exterior-front-angled.jpg";

/*
 * Each layer is a clip-path region of the full image that "floats out"
 * on scroll. Coordinates are percentages of the image dimensions.
 *
 * clipPath: polygon points isolating this region
 * tx/ty: translate direction when exploded (in vw/vh units)
 * label: callout text
 * labelPos: where the label sits relative to the layer
 */
interface Layer {
  id: string;
  clipPath: string;
  tx: number; // translateX in px at full explosion
  ty: number; // translateY in px at full explosion
  label: string;
  labelAnchor: "left" | "right";
  labelTop: string; // CSS top position for label
  labelSide: string; // CSS left or right position
}

const layers: Layer[] = [
  {
    id: "roofline",
    clipPath: "polygon(0% 0%, 100% 0%, 100% 28%, 72% 28%, 50% 18%, 28% 28%, 0% 28%)",
    tx: 0,
    ty: -80,
    label: "Custom Roofline Angles",
    labelAnchor: "right",
    labelTop: "5%",
    labelSide: "5%",
  },
  {
    id: "stone-left",
    clipPath: "polygon(20% 20%, 35% 20%, 35% 75%, 20% 75%)",
    tx: -100,
    ty: -20,
    label: "Natural Stone Veneer",
    labelAnchor: "left",
    labelTop: "35%",
    labelSide: "2%",
  },
  {
    id: "wood-siding-left",
    clipPath: "polygon(0% 22%, 20% 22%, 20% 72%, 0% 72%)",
    tx: -120,
    ty: 10,
    label: "Horizontal Wood Siding",
    labelAnchor: "left",
    labelTop: "50%",
    labelSide: "2%",
  },
  {
    id: "arched-entry",
    clipPath: "polygon(35% 15%, 65% 15%, 65% 80%, 35% 80%)",
    tx: 0,
    ty: -50,
    label: "Arched Entry Portico",
    labelAnchor: "right",
    labelTop: "20%",
    labelSide: "5%",
  },
  {
    id: "stone-right",
    clipPath: "polygon(65% 20%, 80% 20%, 80% 75%, 65% 75%)",
    tx: 100,
    ty: -20,
    label: "Stacked Stone Columns",
    labelAnchor: "right",
    labelTop: "35%",
    labelSide: "2%",
  },
  {
    id: "wood-siding-right",
    clipPath: "polygon(80% 22%, 100% 22%, 100% 72%, 80% 72%)",
    tx: 120,
    ty: 10,
    label: "Cedar Accent Panels",
    labelAnchor: "right",
    labelTop: "50%",
    labelSide: "2%",
  },
  {
    id: "landscaping",
    clipPath: "polygon(0% 72%, 100% 72%, 100% 100%, 0% 100%)",
    tx: 0,
    ty: 80,
    label: "Custom Landscaping & Hardscape",
    labelAnchor: "left",
    labelTop: "85%",
    labelSide: "5%",
  },
];

export default function ExplodedHero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Phase 1 (0→0.5): layers explode outward
  // Phase 2 (0.5→0.8): hold exploded with labels visible
  // Phase 3 (0.8→1.0): collapse back together
  const explodeProgress = useTransform(
    scrollYProgress,
    [0, 0.1, 0.45, 0.75, 1.0],
    [0, 0, 1, 1, 0]
  );

  // Label opacity: fade in as layers explode, fade out as they collapse
  const labelOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.8, 0.95],
    [0, 0, 1, 1, 0]
  );

  // Hero text: visible at start, fades as explosion begins
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.05, 0.12], [1, 1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.12], [0, -30]);

  // Section title that appears during exploded state
  const sectionTitleOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.3, 0.75, 0.9],
    [0, 1, 1, 0]
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-charcoal-900"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Base image (always visible, sits behind layers) */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />
          {/* Dim overlay that intensifies during explosion */}
          <motion.div
            className="absolute inset-0 bg-charcoal-900"
            style={{ opacity: useTransform(explodeProgress, [0, 1], [0, 0.7]) }}
          />
        </div>

        {/* Exploding layers */}
        {layers.map((layer) => (
          <ExplodingLayer
            key={layer.id}
            layer={layer}
            explodeProgress={explodeProgress}
            labelOpacity={labelOpacity}
          />
        ))}

        {/* Hero text overlay — visible at start */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 pointer-events-none"
          style={{ opacity: heroTextOpacity, y: heroTextY }}
        >
          <p className="text-walnut-300 text-sm tracking-[0.4em] uppercase mb-4">
            Kiefer Built Contracting
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
            Built to
            <br />
            <span className="text-sand-300">Inspire</span>
          </h1>
          <p className="text-sand-200/80 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Custom homes crafted with precision and purpose in Northern
            Colorado. Where quality meets vision.
          </p>
        </motion.div>

        {/* Section title during exploded state */}
        <motion.div
          className="absolute top-8 left-0 right-0 text-center z-20 pointer-events-none"
          style={{ opacity: sectionTitleOpacity }}
        >
          <p className="text-walnut-400 text-xs tracking-[0.4em] uppercase mb-2">
            Craftsmanship in Every Detail
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Materials & Design
          </h2>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ opacity: heroTextOpacity }}
        >
          <div className="w-5 h-8 border-2 border-sand-300/50 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-sand-300/70 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Individual Exploding Layer ─── */

import type { MotionValue } from "framer-motion";

function ExplodingLayer({
  layer,
  explodeProgress,
  labelOpacity,
}: {
  layer: Layer;
  explodeProgress: MotionValue<number>;
  labelOpacity: MotionValue<number>;
}) {
  const x = useTransform(explodeProgress, [0, 1], [0, layer.tx]);
  const y = useTransform(explodeProgress, [0, 1], [0, layer.ty]);
  const scale = useTransform(explodeProgress, [0, 1], [1, 0.92]);

  // Subtle shadow that grows as layer lifts
  const shadow = useTransform(
    explodeProgress,
    [0, 1],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 20px 60px rgba(0,0,0,0.5)"]
  );

  // Border glow on exploded layers
  const borderOpacity = useTransform(explodeProgress, [0, 0.5, 1], [0, 0, 0.6]);

  return (
    <>
      {/* The layer itself */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          clipPath: layer.clipPath,
          x,
          y,
          scale,
          boxShadow: shadow,
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        {/* Border highlight */}
        <motion.div
          className="absolute inset-0 border-2 border-walnut-400 pointer-events-none"
          style={{
            clipPath: layer.clipPath,
            opacity: borderOpacity,
          }}
        />
      </motion.div>

      {/* Label callout */}
      <motion.div
        className="absolute z-30 pointer-events-none"
        style={{
          top: layer.labelTop,
          ...(layer.labelAnchor === "left"
            ? { left: layer.labelSide }
            : { right: layer.labelSide }),
          opacity: labelOpacity,
          x,
          y,
        }}
      >
        <div
          className={`flex items-center gap-3 ${
            layer.labelAnchor === "right" ? "flex-row-reverse" : ""
          }`}
        >
          <div className="h-px w-10 bg-walnut-400" />
          <span className="text-white text-xs md:text-sm font-medium tracking-wider uppercase whitespace-nowrap bg-charcoal-900/70 backdrop-blur-sm px-3 py-1.5 rounded">
            {layer.label}
          </span>
        </div>
      </motion.div>
    </>
  );
}
