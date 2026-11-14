// Air drawn as soft ribbons of fine strands, in the render's pixel space
// (see anchors.json). Pure geometry, so it renders identically on the server.

export type Point = [number, number];
export type AirKind = "warm" | "cold";

export type RibbonSpec = {
  id: string;
  kind: AirKind;
  /** Control points from where the air enters the scene to where it leaves. */
  points: Point[];
  /** Bundle width (px) at each control point: narrow at a gap, wider in open air. */
  widths: number[];
  strands?: number;
  opacity?: number;
};

export type Strand = { d: string; width: number; opacity: number; delay: number; duration: number };

export type Ribbon = {
  id: string;
  kind: AirKind;
  centerline: string;
  strands: Strand[];
  gradient: { x1: number; y1: number; x2: number; y2: number };
  opacity: number;
  /** Widest point of the bundle, for the soft glow under the strands. */
  maxWidth: number;
};

// Small deterministic PRNG so server and browser draw the same strands.
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFrom(text: string) {
  let hash = 2166136261;
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

const round = (value: number) => Math.round(value * 10) / 10;

/** Smooth path through the points (uniform Catmull-Rom as cubic Béziers). */
export function smoothPath(points: Point[]): string {
  if (points.length < 2) throw new Error("A ribbon needs at least two points");
  const at = (index: number) => points[Math.max(0, Math.min(points.length - 1, index))];
  let d = `M${round(points[0][0])} ${round(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p2[0])} ${round(p2[1])}`;
  }
  return d;
}

function normals(points: Point[]): Point[] {
  return points.map((_, i) => {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const length = Math.hypot(dx, dy) || 1;
    return [-dy / length, dx / length];
  });
}

export function buildRibbon(spec: RibbonSpec): Ribbon {
  if (spec.widths.length !== spec.points.length) {
    throw new Error(`Ribbon ${spec.id} needs one width per point`);
  }
  const rand = random(seedFrom(spec.id));
  const count = spec.strands ?? 11;
  const n = normals(spec.points);
  const strands: Strand[] = [];
  for (let k = 0; k < count; k++) {
    const lane = count === 1 ? 0 : k / (count - 1) - 0.5;
    const drift = (rand() - 0.5) * 0.18;
    const offsetPoints = spec.points.map(([x, y], i): Point => {
      const spread = spec.widths[i] * (lane + drift + (rand() - 0.5) * 0.08);
      return [x + n[i][0] * spread, y + n[i][1] * spread];
    });
    strands.push({
      d: smoothPath(offsetPoints),
      width: round(0.9 + rand() * 1.9),
      opacity: Math.round((0.35 + rand() * 0.5) * 100) / 100,
      delay: Math.round(rand() * 40) / 10,
      duration: Math.round((3.2 + rand() * 2.4) * 10) / 10,
    });
  }
  const first = spec.points[0];
  const last = spec.points[spec.points.length - 1];
  return {
    id: spec.id,
    kind: spec.kind,
    centerline: smoothPath(spec.points),
    strands,
    gradient: { x1: first[0], y1: first[1], x2: last[0], y2: last[1] },
    opacity: spec.opacity ?? 1,
    maxWidth: Math.max(...spec.widths),
  };
}
