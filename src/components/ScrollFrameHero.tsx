"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const TOTAL_FRAMES = 180;

function getFrameSrc(index: number): string {
  const padded = String(index).padStart(3, "0");
  return `/images/explode-frames/frame-${padded}.jpg`;
}

/*
 * Labels that appear ONE AT A TIME during the hold phase (frames 81-160).
 * The hold phase maps to ~45%-89% of scroll progress.
 * Each label gets an equal slice of that range.
 */
const LABELS = [
  "Custom Roofline Angles",
  "Natural Stone Veneer",
  "Cedar Wood Siding",
  "Arched Entry Portico",
  "Stacked Stone Columns",
  "Horizontal Accent Panels",
  "Custom Landscaping & Hardscape",
];

const HOLD_START_PROGRESS = 80 / 180;  // ~0.444
const HOLD_END_PROGRESS = 160 / 180;   // ~0.889
const LABEL_SLICE = (HOLD_END_PROGRESS - HOLD_START_PROGRESS) / LABELS.length;

export default function ScrollFrameHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [labelOpacity, setLabelOpacity] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to frame index (1-based)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);

  // Hero text: visible at start, fades out as house begins to explode
  const textOpacity = useTransform(scrollYProgress, [0, 0.02, 0.06, 0.12], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.02], [20, 0]);

  // Track scroll to show labels one at a time
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (progress >= HOLD_START_PROGRESS && progress <= HOLD_END_PROGRESS) {
      const holdProgress = progress - HOLD_START_PROGRESS;
      const labelIndex = Math.min(
        Math.floor(holdProgress / LABEL_SLICE),
        LABELS.length - 1
      );

      // Calculate fade within this label's slice
      const sliceProgress = (holdProgress - labelIndex * LABEL_SLICE) / LABEL_SLICE;
      let opacity: number;
      if (sliceProgress < 0.15) {
        opacity = sliceProgress / 0.15; // fade in
      } else if (sliceProgress > 0.85) {
        opacity = (1 - sliceProgress) / 0.15; // fade out
      } else {
        opacity = 1; // full
      }

      setActiveLabel(LABELS[labelIndex]);
      setLabelOpacity(Math.max(0, Math.min(1, opacity)));
    } else {
      setActiveLabel(null);
      setLabelOpacity(0);
    }
  });

  // Preload all frames
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        loaded++;
        setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
        if (loaded === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        loaded++;
        setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
        if (loaded === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      images[i] = img;
    }

    imagesRef.current = images;
  }, []);

  // Draw frame to canvas — scaled to cover the full viewport width
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const clampedIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)));
      const img = imagesRef.current[clampedIndex];

      if (img && img.complete && img.naturalWidth > 0) {
        const dpr = window.devicePixelRatio || 1;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        if (canvas.width !== vw * dpr || canvas.height !== vh * dpr) {
          canvas.width = vw * dpr;
          canvas.height = vh * dpr;
          ctx.scale(dpr, dpr);
        }

        ctx.clearRect(0, 0, vw, vh);

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const vpRatio = vw / vh;
        let drawW: number, drawH: number, drawX: number, drawY: number;

        if (imgRatio > vpRatio) {
          drawH = vh;
          drawW = vh * imgRatio;
          drawX = (vw - drawW) / 2;
          drawY = 0;
        } else {
          drawW = vw;
          drawH = vw / imgRatio;
          drawX = 0;
          drawY = (vh - drawH) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }
    },
    []
  );

  // Draw first frame once loaded + redraw on resize
  useEffect(() => {
    if (!isLoaded) return;
    drawFrame(frameIndex.get());

    const onResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
      drawFrame(frameIndex.get());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isLoaded, drawFrame, frameIndex]);

  // Update canvas on scroll
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (isLoaded) {
      drawFrame(latest);
    }
  });

  return (
    <section
      ref={sectionRef}
      className="relative bg-charcoal-900"
      style={{ height: "300vh" }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Loading state */}
        {!isLoaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-charcoal-900">
            <div className="w-48 h-[2px] bg-charcoal-700 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-walnut-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${loadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sand-400/60 text-xs tracking-[0.3em] uppercase">
              Loading
            </p>
          </div>
        )}

        {/* Canvas — full viewport */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />

        {/* Dark overlay for hero text readability */}
        <motion.div
          className="absolute inset-0 bg-charcoal-900/30 pointer-events-none"
          style={{ opacity: textOpacity }}
        />

        {/* Hero text overlay */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none z-10"
          style={{ opacity: textOpacity, y: textY }}
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

        {/* Feature label — one at a time during hold phase */}
        {activeLabel && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            style={{ opacity: labelOpacity, transition: "opacity 0.15s ease" }}
          >
            <div className="bg-charcoal-900/70 backdrop-blur-sm px-8 py-4 rounded-lg border border-walnut-500/30">
              <p className="text-walnut-300 text-xs tracking-[0.4em] uppercase mb-1">
                Craftsmanship Detail
              </p>
              <p className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide">
                {activeLabel}
              </p>
            </div>
          </div>
        )}

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ opacity: textOpacity }}
        >
          <div className="w-5 h-8 border-2 border-sand-300/50 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-sand-300/70 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
