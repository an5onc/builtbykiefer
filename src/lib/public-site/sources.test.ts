import { describe, expect, it } from "vitest";
import type { PublicPageContent } from "./content";
import { publicPages } from "./content";
import { educationSources, SOURCES_DISCLAIMER } from "./sources";

const EDUCATION_KEYS = [
  "whyKieferBuilt",
  "sips",
  "energyEfficiency",
  "indoorAirQuality",
  "builtForColorado",
  "quality",
  "costOfOwnership",
] as const;

function citedSourceIds(page: PublicPageContent): number[] {
  return [
    ...(page.proof ?? []).flatMap((proof) =>
      proof.sourceId === undefined ? [] : [proof.sourceId],
    ),
    ...(page.sections ?? []).flatMap((section) => [
      ...(section.sourceIds ?? []),
      ...(section.comparison?.rows ?? []).flatMap((row) =>
        row.sourceId === undefined ? [] : [row.sourceId],
      ),
    ]),
  ];
}

describe("education source integrity", () => {
  it("defines the 13 stable guide sources with the locked independence labels", () => {
    expect(educationSources.map((source) => source.id)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
    ]);

    for (const source of educationSources) {
      expect(source.citation.length, `empty citation ${source.id}`).toBeGreaterThan(0);
      expect(source.independent).toBe(![3, 4, 5].includes(source.id));
    }

    // Disclaimer is number-agnostic: pages renumber sources locally, so it keys
    // off the "Industry testing data" badge rather than the guide's global IDs.
    expect(SOURCES_DISCLAIMER).toMatch(/Industry testing data/);
    expect(SOURCES_DISCLAIMER).toMatch(/independent government, national laboratory, and public agency data/);
    expect(SOURCES_DISCLAIMER).not.toMatch(/Citations?\s+\d/);
  });

  it("resolves every citation attached to every education page", () => {
    const knownSourceIds = new Set(educationSources.map((source) => source.id));

    for (const key of EDUCATION_KEYS) {
      const citedIds = citedSourceIds(publicPages[key]);
      expect(citedIds.length, `${key} must cite at least one source`).toBeGreaterThan(0);

      for (const sourceId of citedIds) {
        expect(knownSourceIds.has(sourceId), `${key} has dangling source ${sourceId}`).toBe(true);
      }
    }
  });

  it("exercises industry-data labeling on both comparison pages", () => {
    const industryIds = new Set([3, 4, 5]);
    const sipsIds = citedSourceIds(publicPages.sips);
    const coloradoIds = citedSourceIds(publicPages.builtForColorado);

    expect(sipsIds.some((sourceId) => industryIds.has(sourceId))).toBe(true);
    expect(coloradoIds.some((sourceId) => industryIds.has(sourceId))).toBe(true);
  });

  it("keeps explicitly omitted figures out of published education copy", () => {
    const publishedCopy = JSON.stringify(EDUCATION_KEYS.map((key) => publicPages[key]));
    expect(publishedCopy).not.toMatch(/20\.6%/i);
    expect(publishedCopy).not.toMatch(/10\s*dB/i);
    expect(publishedCopy).not.toMatch(/\$[^\s]+\s*\/\s*kWh/i);
  });
});
