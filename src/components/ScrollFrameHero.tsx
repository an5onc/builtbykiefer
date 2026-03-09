"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const TOTAL_FRAMES = 145;

function getFrameSrc(index: number): string {
  const padded = String(index).padStart(3, "0");
  return `/images/earth-frames/frame-${padded}.jpg`;
}

export default function ScrollFrameHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Scroll tracking: the section is 3x viewport height (300vh)
  // so we get a nice slow scrub through all frames
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to frame index (1-based)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);

  // Overlay text opacity: fade in during first 20% of scroll, fade out during last 20%
  const textOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15, 0.85, 0.92, 1], [0, 0, 1, 1, 0, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.08, 0.15], [40, 40, 0]);

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
        // Match canvas resolution to the viewport for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        if (canvas.width !== vw * dpr || canvas.height !== vh * dpr) {
          canvas.width = vw * dpr;
          canvas.height = vh * dpr;
          ctx.scale(dpr, dpr);
        }

        ctx.clearRect(0, 0, vw, vh);

        // "object-fit: cover" — scale image to fill viewport, crop overflow
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const vpRatio = vw / vh;
        let drawW: number, drawH: number, drawX: number, drawY: number;

        if (imgRatio > vpRatio) {
          // Image is wider than viewport ratio — fit height, crop sides
          drawH = vh;
          drawW = vh * imgRatio;
          drawX = (vw - drawW) / 2;
          drawY = 0;
        } else {
          // Image is taller than viewport ratio — fit width, crop top/bottom
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
      // Reset canvas dimensions so drawFrame recalculates
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
      {/* Sticky container: stays viewport-pinned while user scrolls through 300vh */}
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

        {/* Canvas for frame rendering — full viewport coverage */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />

        {/* Dark overlay for text readability */}
        <motion.div
          className="absolute inset-0 bg-charcoal-900/30 pointer-events-none"
          style={{ opacity: textOpacity }}
        />

        {/* Overlay content */}
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

        {/* Scroll indicator at bottom */}
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
