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

  it("offers original-source HTTPS links for every retained citation", () => {
    const primaryHosts = new Set(["www.epa.gov", "pubmed.ncbi.nlm.nih.gov", "www.sips.org", "www.energy.gov", "www.portersips.com", "doi.colorado.gov", "bouldercounty.gov", "wwa.colorado.edu", "www.larimer.gov"]);
    for (const source of educationSources) {
      expect(source.links.length, `source ${source.id} needs a readable original link`).toBeGreaterThan(0);
      for (const link of source.links) {
        const url = new URL(link.url);
        expect(url.protocol).toBe("https:");
        expect(primaryHosts.has(url.hostname)).toBe(true);
        expect(link.label.length).toBeGreaterThan(5);
      }
    }
  });

  it("keeps research comparisons separate from Kiefer project guarantees", () => {
    expect(publicPages.sips.sections?.[0].comparison?.columns).not.toContain("Kiefer Built SIP");
    expect(publicPages.energyEfficiency.sections?.[0].body).toMatch(/calibrated-model comparison/);
    expect(publicPages.energyEfficiency.sections?.[1].body).toMatch(/Mantell-Hecathorn/);
    expect(publicPages.indoorAirQuality.sections?.[1].body).toMatch(/overall health did not differ significantly/);
    const copy = JSON.stringify(EDUCATION_KEYS.map((key) => publicPages[key]));
    expect(copy).not.toMatch(/140\+ mph|R-9\.5|ten-month|12,000|national hail-claim rank|standard-construction control/);
    expect(publicPages.accolades.cards?.[0].href).toBe("https://www.sips.org/sipa-2025-building-excellence-award-winners");
  });

  it("keeps explicitly omitted figures out of published education copy", () => {
    const publishedCopy = JSON.stringify(EDUCATION_KEYS.map((key) => publicPages[key]));
    expect(publishedCopy).not.toMatch(/20\.6%/i);
    expect(publishedCopy).not.toMatch(/10\s*dB/i);
    expect(publishedCopy).not.toMatch(/\$[^\s]+\s*\/\s*kWh/i);
  });
});
