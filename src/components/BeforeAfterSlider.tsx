"use client";

import { useState, useRef, useEffect, MouseEvent, TouchEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { BeforeAfterSliderProps } from "@/types/slider";

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // Clamp between 0 and 100
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
    setSliderPosition(clampedPercentage);
  };

  // Mouse events
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events
  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !e.touches[0]) return;
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Global mouse up listener (in case user releases outside container)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
      window.addEventListener("touchend", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] select-none overflow-hidden rounded-lg border border-stone-300 shadow-xl ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Before Image (full width) */}
      <div className="absolute inset-0">
        <Image
          src={beforeImage}
          alt={beforeAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Before Label */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 bg-charcoal-800/90 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider rounded-md border border-charcoal-600">
            Before
          </span>
        </div>
      </div>

      {/* After Image (clipped by slider position) */}
      <div
        className="absolute inset-0 overflow-hidden transition-[clip-path] duration-75 ease-out"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <Image
          src={afterImage}
          alt={afterAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* After Label */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1.5 bg-walnut-600/90 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider rounded-md border border-walnut-500">
            After
          </span>
        </div>
      </div>

      {/* Slider Line and Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-20 transition-[left] duration-75 ease-out"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-12 h-12 bg-white rounded-full shadow-xl border-4 border-white flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Left/Right Arrows */}
            <div className="flex items-center gap-0.5">
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                className="text-charcoal-600"
              >
                <path
                  d="M6 10L2 6L6 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                className="text-charcoal-600"
              >
                <path
                  d="M2 2L6 6L2 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Top arrow indicator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2">
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
        </div>

        {/* Bottom arrow indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2">
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-white"></div>
        </div>
      </div>

      {/* Drag instruction hint (visible on initial load, fades after interaction) */}
      {sliderPosition === 50 && !isDragging && (
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="px-4 py-2 bg-charcoal-800/90 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-charcoal-600 flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-walnut-400"
            >
              <path
                d="M3 8h10M8 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Drag to compare</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
