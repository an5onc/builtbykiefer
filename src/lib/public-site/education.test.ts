import { describe, expect, it } from "vitest";
import { publicPages } from "./content";

const EDUCATION_KEYS = [
  "whyKieferBuilt",
  "sips",
  "energyEfficiency",
  "quality",
  "costOfOwnership",
] as const;

describe("why-kiefer-built education content", () => {
  it("defines every education page with required fields", () => {
    for (const key of EDUCATION_KEYS) {
      const page = publicPages[key];
      expect(page, `missing page: ${key}`).toBeDefined();
      expect(page.title.length).toBeGreaterThan(0);
      expect(page.description.length).toBeGreaterThan(0);
      expect(page.heroImage).toMatch(/^\/images\//);
      expect(page.heroAlt.length).toBeGreaterThan(0);
    }
  });

  it("hub links to each of the four child pages", () => {
    const hrefs = (publicPages.whyKieferBuilt.cards ?? []).map((card) => card.href);
    expect(hrefs).toContain("/why-kiefer-built/sips");
    expect(hrefs).toContain("/why-kiefer-built/energy-efficiency");
    expect(hrefs).toContain("/why-kiefer-built/quality");
    expect(hrefs).toContain("/why-kiefer-built/cost-of-ownership");
  });

  it("cites the 2025 SIPA award on the SIPs page", () => {
    const proofValues = (publicPages.sips.proof ?? []).map((p) => p.label + p.value).join(" ");
    const bodyText = (publicPages.sips.sections ?? []).map((s) => s.body).join(" ");
    expect(`${proofValues} ${bodyText}`).toMatch(/SIPA/);
  });
});
