import { describe, expect, it } from "vitest";
import { educationSources } from "@/lib/public-site/sources";
import { closeupTitles, illustrationTitles, modeLabels, viewCaptions, wallContent, wallModes, previewContent, zoomLabels, type SourcedText } from "./content";

const knownSourceIds = new Set(educationSources.map((source) => source.id));
const variants = Object.entries(wallContent);

function sourcedTexts() {
  return variants.flatMap(([variant, content]) =>
    content.mechanisms.flatMap((mechanism) =>
      wallModes.map((mode) => ({ where: `${variant}/${mechanism.id}/${mode}`, sourced: mechanism.states[mode] as SourcedText })),
    ),
  );
}

describe("wall comparison content", () => {
  it("cites only sources that exist", () => {
    for (const { where, sourced } of sourcedTexts()) {
      for (const sourceId of sourced.sourceIds ?? []) {
        expect(knownSourceIds.has(sourceId), `${where} cites unknown source ${sourceId}`).toBe(true);
      }
    }
    for (const [variant, content] of variants) {
      if (content.sourceLink) {
        expect(knownSourceIds.has(content.sourceLink.sourceId), `${variant} source link`).toBe(true);
      }
    }
  });

  it("puts numerals only in sentences that carry a source", () => {
    for (const { where, sourced } of sourcedTexts()) {
      if (/\d/.test(sourced.text)) {
        expect(sourced.sourceIds?.length ?? 0, `${where}: "${sourced.text}"`).toBeGreaterThan(0);
      }
    }
    const unsourced = [
      ...variants.flatMap(([, content]) => [content.heading, content.intro ?? "", content.finePrint, content.learnMore?.label ?? ""]),
      ...variants.flatMap(([, content]) => content.mechanisms.map((mechanism) => mechanism.title)),
      ...Object.values(illustrationTitles),
      ...Object.values(closeupTitles),
      ...Object.values(zoomLabels),
      previewContent.label,
      ...Object.values(modeLabels),
      ...Object.values(viewCaptions),
    ];
    for (const text of unsourced) {
      expect(text, `unsourced copy contains a numeral: "${text}"`).not.toMatch(/\d/);
    }
  });

  it("states the ORNL figure only with its test-room caveat", () => {
    for (const { where, sourced } of sourcedTexts()) {
      if (sourced.text.includes("15×")) {
        expect(sourced.sourceIds, where).toContain(9);
        expect(sourced.text, where).toMatch(/best-sealed SIP (test )?room/);
      }
    }
  });

  it("covers both wall states with the mechanisms each placement shows", () => {
    expect(wallContent.full.mechanisms.map((mechanism) => mechanism.id)).toEqual(["air", "heat"]);
    expect(wallContent.compact.mechanisms.map((mechanism) => mechanism.id)).toEqual(["air"]);
    for (const { where, sourced } of sourcedTexts()) {
      expect(sourced.text.trim().length, where).toBeGreaterThan(0);
    }
  });

  it("never promises bills, savings or R-values", () => {
    const allCopy = JSON.stringify(wallContent) + JSON.stringify(illustrationTitles) + JSON.stringify(closeupTitles);
    expect(allCopy).not.toMatch(/\$|bill|saving|R-value|percent|%/i);
  });
});
