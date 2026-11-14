import { describe, expect, it } from "vitest";
import { buildRibbon, smoothPath, type RibbonSpec } from "./airflow";
import { markerPositions, ribbons, RENDER_SIZE } from "./airRibbons";

const spec: RibbonSpec = {
  id: "test",
  kind: "warm",
  points: [
    [0, 0],
    [100, 50],
    [200, 0],
  ],
  widths: [5, 20, 10],
};

function numbers(d: string) {
  return [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
}

describe("air ribbons", () => {
  it("draws the same strands on every render so hydration matches", () => {
    expect(buildRibbon(spec)).toEqual(buildRibbon(spec));
    expect(buildRibbon({ ...spec, id: "other" }).strands[0].d).not.toBe(buildRibbon(spec).strands[0].d);
  });

  it("rejects malformed ribbon specs", () => {
    expect(() => smoothPath([[0, 0]])).toThrow();
    expect(() => buildRibbon({ ...spec, widths: [5, 20] })).toThrow(/one width per point/);
  });

  it("keeps every ribbon inside the render frame", () => {
    for (const ribbon of [...ribbons.stick, ...ribbons.sip]) {
      const values = numbers(ribbon.centerline);
      const xs = values.filter((_, index) => index % 2 === 0);
      const ys = values.filter((_, index) => index % 2 === 1);
      expect(Math.min(...xs), ribbon.id).toBeGreaterThanOrEqual(0);
      expect(Math.max(...xs), ribbon.id).toBeLessThanOrEqual(RENDER_SIZE.width);
      expect(Math.min(...ys), ribbon.id).toBeGreaterThanOrEqual(0);
      expect(Math.max(...ys), ribbon.id).toBeLessThanOrEqual(RENDER_SIZE.height);
    }
  });

  it("shows warm air escaping and cold air entering a framed house, and mostly outside air around SIPs", () => {
    const kinds = (mode: "stick" | "sip") => ribbons[mode].map((ribbon) => ribbon.kind);
    expect(kinds("stick")).toContain("warm");
    expect(kinds("stick")).toContain("cold");
    const sipWarm = ribbons.sip.filter((ribbon) => ribbon.kind === "warm");
    expect(sipWarm).toHaveLength(1);
    expect(sipWarm[0].opacity).toBeLessThan(1);
    expect(ribbons.sip.length).toBeLessThan(ribbons.stick.length);
  });

  it("places the two markers inside the image and far enough apart for a phone", () => {
    const { air, heat } = markerPositions;
    for (const point of [air, heat]) {
      expect(point.x).toBeGreaterThan(0.05);
      expect(point.x).toBeLessThan(0.95);
      expect(point.y).toBeGreaterThan(0.05);
      expect(point.y).toBeLessThan(0.95);
    }
    expect(Math.hypot(air.x - heat.x, air.y - heat.y)).toBeGreaterThan(0.12);
  });
});
