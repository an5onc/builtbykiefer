"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { useId } from "react";
import type { MechanismId, WallMode } from "./content";
import { useHydrated } from "./useHydrated";

type WallCloseupProps = {
  mode: WallMode;
  markers: MechanismId[];
  highlight?: MechanismId | null;
  title: string;
};

type Box = { x: number; y: number; w: number; h: number };
type Wisp = { x: number; y: number; dir: 1 | -1 };

// The wall seen from inside the house, drywall cut away. Reached by zooming in
// from the house render. Kiefer theme colors (walnut, ember, cream, honey, slate, charcoal).
const WOOD = "#D4B89E";
const WOOD_EDGE = "#9A7452";
const EMBER = "#C9281C";
const EMBER_LIGHT = "#FF6B5C";
const GAP = "#050505";
const WARM_AIR = "#F2780F";

// Framing exists from x 236 to 900 and y 110 to 500 in a 960 x 600 drawing.
const FRAME_X = 236;
const FRAME_W = 664;

const upperTopPlate: Box = { x: FRAME_X, y: 110, w: FRAME_W, h: 18 };
const bottomPlate: Box = { x: FRAME_X, y: 482, w: FRAME_W, h: 18 };

// Stick-only members, sorted left to right so the transition can sweep across the wall.
const stickFraming: Box[] = [
  { x: FRAME_X, y: 128, w: FRAME_W, h: 18 }, // second top plate
  ...[236, 300, 364, 428, 492, 772, 836, 884].map((x) => ({ x, y: 146, w: 16, h: 336 })), // studs and king studs
  ...[508, 756].map((x) => ({ x, y: 210, w: 16, h: 272 })), // jack studs
  { x: 508, y: 186, w: 264, h: 24 }, // header
  { x: 524, y: 380, w: 232, h: 12 }, // rough sill
  ...[572, 632, 692].flatMap((x) => [
    { x, y: 146, w: 16, h: 40 }, // cripples above the header
    { x, y: 392, w: 16, h: 90 }, // cripples below the sill
  ]),
].sort((a, b) => a.x - b.x);

const windowUnit: Box = { x: 524, y: 210, w: 232, h: 170 };
const outlet: Box = { x: 394, y: 392, w: 22, h: 32 };
const seamX = 468;

const stickWisps: Wisp[] = [
  { x: 300, y: 110, dir: -1 }, // top plate
  { x: 836, y: 110, dir: 1 }, // top plate
  { x: 522, y: 250, dir: -1 }, // window rough opening
  { x: 758, y: 300, dir: 1 }, // window rough opening
  { x: 405, y: 392, dir: 1 }, // outlet
  { x: 330, y: 500, dir: -1 }, // sill joint
  { x: 860, y: 500, dir: 1 }, // sill joint
];
const seamWisp: Wisp = { x: seamX, y: 128, dir: 1 };

// ① sits on the window glass beside the leaking rough-opening gap; ② sits on a stud.
const markerPositions: Record<MechanismId, { cx: number; cy: number; label: string }> = {
  air: { cx: 712, cy: 300, label: "1" },
  heat: { cx: 372, cy: 262, label: "2" },
};

const drywallEdge = "L208 140 L220 175 L210 210 L222 248 L211 290 L220 330 L209 372 L221 410 L212 452 L218 500";
const drywallShape = `M40 110 H216 ${drywallEdge} H40 Z`;
const drywallCoreShape = "M216 110 H236 V500 H218 L212 452 L221 410 L209 372 L220 330 L211 290 L222 248 L210 210 L220 175 L208 140 Z";

// A thin bright line along the length of a member, inside its glow.
function hotCore(box: Box) {
  return box.w >= box.h
    ? { x: box.x + 4, y: box.y + box.h / 2 - 2, width: box.w - 8, height: 4 }
    : { x: box.x + box.w / 2 - 2, y: box.y + 4, width: 4, height: box.h - 8 };
}

function wispPath({ x, y, dir }: Wisp) {
  return `M${x} ${y} C${x + dir * 14} ${y - 20} ${x - dir * 10} ${y - 40} ${x + dir * 6} ${y - 56} S${x + dir * 28} ${y - 88} ${x + dir * 16} ${y - 108}`;
}

const ease = [0.65, 0, 0.35, 1] as const;

export default function WallCloseup({ mode, markers, highlight = null, title }: WallCloseupProps) {
  // The server cannot know the visitor's preference, so the first client render
  // matches the server's animated markup and switches after hydration.
  const prefersReducedMotion = useReducedMotion() ?? false;
  const reduce = useHydrated() && prefersReducedMotion;
  const toSip = mode === "sip";
  // SVG ids must be unique per instance and usable inside url(#...).
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (name: string) => `${name}-${uid}`;
  const titleId = id("wall-title");

  const step = (duration: number, delay = 0): Transition =>
    reduce ? { duration: 0 } : { duration, delay, ease };

  const airEmphasis = highlight === "heat" ? 0.25 : 1;
  const heatEmphasis = highlight === "air" ? 0.25 : 1;

  return (
    <svg
      viewBox="0 0 960 600"
      role="img"
      aria-labelledby={titleId}
      className="block h-full w-full"
      data-mode={mode}
    >
      <title id={titleId}>{title}</title>
      <defs>
        <linearGradient id={id("room")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D6CDBD" />
          <stop offset="1" stopColor="#C7BDAB" />
        </linearGradient>
        <linearGradient id={id("paint")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E9E2D6" />
          <stop offset="1" stopColor="#DCD3C4" />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3E5060" />
          <stop offset="1" stopColor="#1A2530" />
        </linearGradient>
        {/* Warm indoor air, matching the warm ribbons on the house. */}
        <linearGradient id={id("air")} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={WARM_AIR} stopOpacity="0.95" />
          <stop offset="1" stopColor={WARM_AIR} stopOpacity="0" />
        </linearGradient>
        <pattern id={id("batt")} width="40" height="24" patternUnits="userSpaceOnUse">
          <rect width="40" height="24" fill="#F5DDA6" fillOpacity="0.16" />
          <path d="M0 12 C10 4 10 20 20 12 S30 4 40 12" fill="none" stroke="#EEC97A" strokeOpacity="0.35" strokeWidth="2" />
        </pattern>
        <pattern id={id("foam")} width="18" height="18" patternUnits="userSpaceOnUse">
          <rect width="18" height="18" fill="#F9F6F0" />
          <circle cx="4" cy="5" r="2.2" fill="#E4DDD0" />
          <circle cx="13" cy="12" r="2.6" fill="#E4DDD0" />
          <circle cx="8" cy="15" r="1.4" fill="#F0EBE0" />
        </pattern>
        <pattern id={id("osb")} width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#9A7452" />
          <rect x="3" y="4" width="8" height="3" fill="#B8916E" transform="rotate(18 7 5)" />
          <rect x="13" y="14" width="7" height="3" fill="#7D5C3C" transform="rotate(-24 16 15)" />
          <rect x="6" y="17" width="5" height="2" fill="#B8916E" />
        </pattern>
        <filter id={id("glow")} x="-60%" y="-20%" width="220%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id={id("haze")} x="-50%" y="-20%" width="200%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <marker id={id("arrow")} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill={WARM_AIR} />
        </marker>
        <clipPath id={id("foam-wipe")}>
          <motion.rect
            x={FRAME_X}
            y={110}
            height={390}
            initial={false}
            animate={{ width: toSip ? FRAME_W : 0 }}
            transition={toSip ? step(0.55, 0.2) : step(0.45)}
          />
        </clipPath>
      </defs>

      {/* Inside the room: ceiling, crown trim and a wood floor. */}
      <rect width="960" height="600" fill={`url(#${id("room")})`} />
      <rect x="0" y="0" width="960" height="96" fill="#8F8577" />
      <rect x="0" y="96" width="960" height="8" fill="#F0EBE0" />
      <rect x="0" y="104" width="960" height="6" fill="#000" fillOpacity="0.25" />
      <rect x="0" y="500" width="960" height="100" fill="#7A5B40" />
      {[0, 1, 2, 3].map((row) => (
        <rect key={row} x="0" y={512 + row * 24} width="960" height="1.5" fill="#5E4430" />
      ))}
      <rect x="0" y="500" width="960" height="5" fill="#000" fillOpacity="0.3" />

      {/* Back of the exterior sheathing, seen through the open cavities. */}
      <rect x={FRAME_X} y="110" width={FRAME_W} height="390" fill="#3A2E24" />

      {/* Stick frame: insulation batts between studs, then the framing members. */}
      <motion.rect
        x={FRAME_X}
        y="146"
        width={FRAME_W}
        height="336"
        fill={`url(#${id("batt")})`}
        initial={false}
        animate={{ opacity: toSip ? 0 : 1 }}
        transition={toSip ? step(0.3, 0.45) : step(0.3, 0.05)}
      />
      {stickFraming.map((box, index) => (
        <motion.rect
          key={`${box.x}-${box.y}`}
          x={box.x}
          y={box.y}
          width={box.w}
          height={box.h}
          fill={WOOD}
          stroke={WOOD_EDGE}
          strokeWidth="1.5"
          initial={false}
          animate={{ opacity: toSip ? 0 : 1 }}
          transition={toSip ? step(0.25, 0.15 + index * 0.02) : step(0.25, 0.1 + index * 0.02)}
        />
      ))}

      {/* SIP: a foam core between structural skins, wiped in from the cut edge. */}
      <g clipPath={`url(#${id("foam-wipe")})`} data-layer="sip">
        <rect x={FRAME_X} y="128" width={FRAME_W} height="354" fill={`url(#${id("foam")})`} />
        <rect x={FRAME_X} y="128" width={FRAME_W} height="354" fill="none" stroke="#B8916E" strokeWidth="3" />
        <rect x={seamX - 3} y="128" width="6" height="354" fill="#B8916E" />
        <line x1={seamX} y1="128" x2={seamX} y2="482" stroke="#553D2B" strokeWidth="1.5" />
        <rect x="508" y="196" width="264" height="198" fill={WOOD} stroke={WOOD_EDGE} strokeWidth="1.5" />
      </g>

      {/* Plates present in both walls. */}
      {[upperTopPlate, bottomPlate].map((box) => (
        <rect key={box.y} x={box.x} y={box.y} width={box.w} height={box.h} fill={WOOD} stroke={WOOD_EDGE} strokeWidth="1.5" />
      ))}

      {/* ② Heat through framing: warm glow along every stud and plate (stick frame only). */}
      <motion.g initial={false} animate={{ opacity: heatEmphasis }} transition={step(0.2)} aria-hidden="true">
        <motion.g
          initial={false}
          animate={{ opacity: toSip ? 0 : 1 }}
          transition={toSip ? step(0.35) : step(0.35, 0.45)}
          data-layer="heat"
        >
          <motion.g
            filter={`url(#${id("glow")})`}
            initial={{ opacity: 0.65 }}
            animate={reduce ? { opacity: 0.7 } : { opacity: [0.45, 0.85, 0.45] }}
            transition={reduce ? { duration: 0 } : { duration: 2.8, ease: "easeInOut", repeat: Infinity }}
          >
            {[...stickFraming, upperTopPlate, bottomPlate].map((box) => (
              <rect key={`glow-${box.x}-${box.y}`} x={box.x} y={box.y} width={box.w} height={box.h} fill={EMBER} />
            ))}
          </motion.g>
          {[...stickFraming, upperTopPlate, bottomPlate].map((box) => (
            <rect key={`core-${box.x}-${box.y}`} {...hotCore(box)} fill={EMBER_LIGHT} fillOpacity="0.45" />
          ))}
        </motion.g>
      </motion.g>

      {/* Window and outlet appear in both walls. */}
      <rect x={windowUnit.x} y={windowUnit.y} width={windowUnit.w} height={windowUnit.h} fill="#F0EBE0" />
      <rect x={windowUnit.x + 12} y={windowUnit.y + 12} width={windowUnit.w - 24} height={windowUnit.h - 24} fill={`url(#${id("glass")})`} />
      <rect x={windowUnit.x + windowUnit.w / 2 - 4} y={windowUnit.y + 12} width="8" height={windowUnit.h - 24} fill="#F0EBE0" />
      <path d={`M${windowUnit.x + 30} ${windowUnit.y + 158} L${windowUnit.x + 92} ${windowUnit.y + 12} H${windowUnit.x + 122} L${windowUnit.x + 60} ${windowUnit.y + 158} Z`} fill="#fff" fillOpacity="0.07" />
      <rect x={outlet.x} y={outlet.y} width={outlet.w} height={outlet.h} rx="3" fill="#F0EBE0" stroke="#A09282" />
      <rect x={outlet.x + 7} y={outlet.y + 8} width="2.5" height="6" fill="#7A6E60" />
      <rect x={outlet.x + 12.5} y={outlet.y + 8} width="2.5" height="6" fill="#7A6E60" />

      {/* Leak paths in a framed wall: gaps at plates, window and outlet (stick frame only). */}
      <motion.g
        initial={false}
        animate={{ opacity: toSip ? 0 : 1 }}
        transition={toSip ? step(0.25) : step(0.25, 0.4)}
        fill="none"
        stroke={GAP}
        strokeWidth="3"
        aria-hidden="true"
      >
        <rect x={windowUnit.x - 2} y={windowUnit.y - 2} width={windowUnit.w + 4} height={windowUnit.h + 4} />
        <line x1={FRAME_X} y1="110" x2="900" y2="110" />
        <line x1={FRAME_X} y1="500" x2="900" y2="500" />
        <rect x={outlet.x - 2} y={outlet.y - 2} width={outlet.w + 4} height={outlet.h + 4} rx="4" />
      </motion.g>

      {/* Painted drywall with its baseboard, cut away along a ragged edge. */}
      <path d={drywallShape} fill={`url(#${id("paint")})`} />
      <rect x="40" y="472" width="170" height="28" fill="#F7F3EC" />
      <rect x="40" y="472" width="170" height="2" fill="#C9BFAF" />
      <path d={drywallCoreShape} fill="#C8C1B4" />
      <rect x="900" y="110" width="6" height="390" fill="#C8C1B4" />
      <path d={`M216 110 ${drywallEdge}`} fill="none" stroke="#8C8476" strokeOpacity="0.7" strokeWidth="1.5" />

      {/* ① Air leakage: streams leaving through the gaps. */}
      <motion.g initial={false} animate={{ opacity: airEmphasis }} transition={step(0.2)} aria-hidden="true">
        <motion.g
          initial={false}
          animate={{ opacity: toSip ? 0 : 1 }}
          transition={toSip ? step(0.25) : step(0.3, 0.5)}
          data-layer="air"
        >
          {stickWisps.map((wisp, index) => (
            <AirStream key={`${wisp.x}-${wisp.y}`} wisp={wisp} index={index} reduce={reduce} gradientId={id("air")} arrowId={id("arrow")} hazeId={id("haze")} />
          ))}
        </motion.g>
        <motion.g
          initial={false}
          animate={{ opacity: toSip ? 0.45 : 0 }}
          transition={toSip ? step(0.3, 0.7) : step(0.15)}
          data-layer="air-seam"
        >
          <AirStream wisp={seamWisp} index={0} reduce={reduce} gradientId={id("air")} arrowId={id("arrow")} hazeId={id("haze")} />
        </motion.g>
      </motion.g>

      {/* Numbered markers that match the captions. */}
      {markers.map((mechanism) => {
        const marker = markerPositions[mechanism];
        const active = highlight === mechanism;
        return (
          <motion.g
            key={mechanism}
            data-marker={mechanism}
            initial={false}
            animate={{ scale: active ? 1.18 : 1 }}
            transition={step(0.2)}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle cx={marker.cx} cy={marker.cy} r="27" fill={EMBER} stroke="#fff" strokeWidth="3.5" />
            <text
              x={marker.cx}
              y={marker.cy}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff"
              fontSize="30"
              fontWeight="700"
              fontFamily="var(--font-geist-sans), system-ui, sans-serif"
            >
              {marker.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

function AirStream({
  wisp,
  index,
  reduce,
  gradientId,
  arrowId,
  hazeId,
}: {
  wisp: Wisp;
  index: number;
  reduce: boolean;
  gradientId: string;
  arrowId: string;
  hazeId: string;
}) {
  const d = wispPath(wisp);
  // A soft blurred band under every stream keeps it visible over busy framing.
  const haze = <path d={d} fill="none" stroke={`url(#${gradientId})`} strokeOpacity="0.45" strokeWidth="14" strokeLinecap="round" filter={`url(#${hazeId})`} />;
  if (reduce) {
    // Still arrows replace the flowing dashes when the visitor prefers reduced motion.
    return (
      <g>
        {haze}
        <path d={d} fill="none" stroke={WARM_AIR} strokeOpacity="0.9" strokeWidth="5" strokeLinecap="round" markerEnd={`url(#${arrowId})`} />
      </g>
    );
  }
  return (
    <g>
      {haze}
      <motion.path
        d={d}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="20 12"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -32 }}
        transition={{ duration: 1, ease: "linear", repeat: Infinity, delay: index * 0.13 }}
      />
    </g>
  );
}
