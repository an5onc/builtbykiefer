"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform, type Transition } from "framer-motion";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { Ribbon } from "./airflow";
import { markerPositions, ribbons, RENDER_SIZE } from "./airRibbons";
import type { MechanismId, WallMode } from "./content";
import { useHydrated } from "./useHydrated";

type WallIllustrationProps = {
  mode: WallMode;
  markers: MechanismId[];
  highlight?: MechanismId | null;
  title: string;
  /** False for a stick-only preview, which then never loads the SIP render or its air. */
  switchable?: boolean;
};

// Cycles renders from tools/render/house.py (same camera, transparent background).
const RENDERS = {
  stick: "/wall-comparison/stick.webp",
  sip: "/wall-comparison/sip.webp",
  heat: "/wall-comparison/stick-heat.webp",
};
const SIZES = "(min-width: 1024px) 58vw, 100vw";
const MARKER_LABELS: Record<MechanismId, string> = { air: "1", heat: "2" };

const AIR_STOPS = {
  warm: ["#ffc06a", "#ffb04d", "#ff8a2a", "#f2640f"],
  cold: ["#a8dcff", "#7cc3fb", "#4f9fe8", "#2f7fd6"],
};

// Air and heat motion are plain CSS so they run without JavaScript and stop for
// visitors who prefer reduced motion. Still ribbons remain in that case.
const MOTION_CSS = `
.kb-air-flow { animation-name: kb-air-flow; animation-timing-function: linear; animation-iteration-count: infinite; }
@keyframes kb-air-flow { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
.kb-air-idle .kb-air-flow { animation-play-state: paused; }
.kb-heat-pulse { animation: kb-heat-pulse 2.8s ease-in-out infinite alternate; }
@keyframes kb-heat-pulse { from { opacity: 0.5; } to { opacity: 0.9; } }
@media (prefers-reduced-motion: reduce) {
  .kb-air-flow { animation: none; opacity: 0; }
  .kb-heat-pulse { animation: none; opacity: 0.75; }
}`;

const ease = [0.65, 0, 0.35, 1] as const;

// The SIP render sits fully clipped until the first switch, and browsers never
// lazy-load a fully clipped image. Fetch it once the illustration nears the viewport.
function useNearViewport() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || near) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [near]);
  return [ref, near] as const;
}

export default function WallIllustration({ mode, markers, highlight = null, title, switchable = true }: WallIllustrationProps) {
  // The server cannot know the visitor's preference, so the first browser render
  // matches the server markup and switches after hydration.
  const prefersReducedMotion = useReducedMotion() ?? false;
  const reduce = useHydrated() && prefersReducedMotion;
  const toSip = mode === "sip";
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [rootRef, nearViewport] = useNearViewport();

  // One number (0 = stick, 100 = SIP) drives both the wipe and its divider. Framer
  // cannot interpolate clip-path strings, so the clip is derived from it.
  const reveal = useMotionValue(toSip ? 100 : 0);
  useEffect(() => {
    const controls = animate(reveal, toSip ? 100 : 0, reduce ? { duration: 0 } : { duration: 0.9, ease });
    return () => controls.stop();
  }, [toSip, reduce, reveal]);
  const sipClip = useTransform(reveal, (value) => `inset(0% ${100 - value}% 0% 0%)`);
  const dividerLeft = useTransform(reveal, (value) => `${value}%`);
  const dividerOpacity = useTransform(reveal, [0, 3, 97, 100], [0, 1, 1, 0]);
  const titleId = `wall-title-${uid}`;

  const step = (duration: number, delay = 0): Transition => (reduce ? { duration: 0 } : { duration, delay, ease });
  const airEmphasis = highlight === "heat" ? 0.3 : 1;
  const heatEmphasis = highlight === "air" ? 0.3 : 1;

  return (
    <div ref={rootRef} role="img" aria-labelledby={titleId} data-mode={mode} className="relative h-full w-full select-none">
      <span id={titleId} className="sr-only">
        {title}
      </span>

      <Image src={RENDERS.stick} alt="" fill sizes={SIZES} className="object-contain" draggable={false} />

      {/* ② Heat through framing: the framing alone, glowing, pulsing over the stick render. */}
      <motion.div
        className="absolute inset-0"
        data-layer="heat"
        initial={false}
        animate={{ opacity: toSip ? 0 : heatEmphasis }}
        transition={toSip ? step(0.25) : step(0.4, 0.55)}
      >
        <div className="kb-heat-pulse absolute inset-0">
          <Image src={RENDERS.heat} alt="" fill sizes={SIZES} className="object-contain opacity-40" draggable={false} />
          <Image src={RENDERS.heat} alt="" fill sizes={SIZES} className="object-contain opacity-25 blur-[5px]" draggable={false} />
        </div>
      </motion.div>

      {/* SIP render, wiped in from the left behind a moving divider. */}
      {switchable ? (
        <>
          <motion.div className="absolute inset-0" data-layer="sip" style={{ clipPath: sipClip }}>
            <Image
              src={RENDERS.sip}
              alt=""
              fill
              sizes={SIZES}
              loading={nearViewport ? "eager" : "lazy"}
              className="object-contain"
              draggable={false}
            />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)]"
            style={{ left: dividerLeft, opacity: dividerOpacity }}
          />
        </>
      ) : null}

      {/* ① Air: soft ribbons of fine strands. */}
      <svg
        viewBox={`0 0 ${RENDER_SIZE.width} ${RENDER_SIZE.height}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <style>{MOTION_CSS}</style>
        <defs>
          {[...ribbons.stick, ...(switchable ? ribbons.sip : [])].map((ribbon) => (
            <linearGradient key={ribbon.id} id={`${uid}-${ribbon.id}`} gradientUnits="userSpaceOnUse" {...ribbon.gradient}>
              {[0, 0.14, 0.6, 1].map((offset, index) => (
                <stop
                  key={offset}
                  offset={offset}
                  stopColor={AIR_STOPS[ribbon.kind][index]}
                  stopOpacity={offset === 0 || offset === 1 ? 0 : offset < 0.5 ? 0.95 : 0.75}
                />
              ))}
            </linearGradient>
          ))}
          <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>
        <motion.g initial={false} animate={{ opacity: airEmphasis }} transition={step(0.2)}>
          <motion.g
            data-layer="air-stick"
            className={toSip ? "kb-air-idle" : undefined}
            initial={false}
            animate={{ opacity: toSip ? 0 : 1 }}
            transition={toSip ? step(0.35) : step(0.5, 0.6)}
          >
            {ribbons.stick.map((ribbon) => (
              <RibbonPaths key={ribbon.id} ribbon={ribbon} uid={uid} />
            ))}
          </motion.g>
          {switchable ? (
            <motion.g
              data-layer="air-sip"
              className={toSip ? undefined : "kb-air-idle"}
              initial={false}
              animate={{ opacity: toSip ? 1 : 0 }}
              transition={toSip ? step(0.5, 0.7) : step(0.25)}
            >
              {ribbons.sip.map((ribbon) => (
                <RibbonPaths key={ribbon.id} ribbon={ribbon} uid={uid} />
              ))}
            </motion.g>
          ) : null}
        </motion.g>
      </svg>

      {/* Numbered markers matching the captions; HTML so they stay legible at any width. */}
      {markers.map((mechanism) => {
        const position = markerPositions[mechanism];
        return (
          <motion.span
            key={mechanism}
            data-marker={mechanism}
            aria-hidden="true"
            className="absolute flex size-8 items-center justify-center rounded-full border-2 border-white bg-[#c9281c] text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.35)] md:size-9"
            style={{ left: `${position.x * 100}%`, top: `${position.y * 100}%`, x: "-50%", y: "-50%" }}
            initial={false}
            animate={{ scale: highlight === mechanism ? 1.18 : 1 }}
            transition={step(0.2)}
          >
            {MARKER_LABELS[mechanism]}
          </motion.span>
        );
      })}
    </div>
  );
}

function RibbonPaths({ ribbon, uid }: { ribbon: Ribbon; uid: string }) {
  const stroke = `url(#${uid}-${ribbon.id})`;
  return (
    <g opacity={ribbon.opacity} data-ribbon={ribbon.id}>
      <path d={ribbon.centerline} fill="none" stroke={stroke} strokeWidth={ribbon.maxWidth * 0.8} strokeLinecap="round" opacity="0.22" filter={`url(#${uid}-soft)`} />
      {ribbon.strands.map((strand, index) => (
        <path key={index} d={strand.d} fill="none" stroke={stroke} strokeWidth={strand.width} strokeLinecap="round" opacity={strand.opacity * 0.75} />
      ))}
      {ribbon.strands.map((strand, index) => (
        <path
          key={`flow-${index}`}
          d={strand.d}
          pathLength={100}
          fill="none"
          stroke={stroke}
          strokeWidth={strand.width * 1.6}
          strokeLinecap="round"
          strokeDasharray="12 88"
          className="kb-air-flow"
          style={{ animationDuration: `${strand.duration}s`, animationDelay: `${-strand.delay}s` }}
        />
      ))}
    </g>
  );
}
