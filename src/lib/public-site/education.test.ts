import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { publicPages } from "./content";

const EDUCATION_KEYS = [
  "whyKieferBuilt",
  "sips",
  "energyEfficiency",
  "indoorAirQuality",
  "builtForColorado",
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

  it("hub links to all six child pages in navigation order", () => {
    const hrefs = (publicPages.whyKieferBuilt.cards ?? []).map((card) => card.href);
    expect(hrefs).toEqual([
      "/why-kiefer-built/sips",
      "/why-kiefer-built/energy-efficiency",
      "/why-kiefer-built/indoor-air-quality",
      "/why-kiefer-built/built-for-colorado",
      "/why-kiefer-built/quality",
      "/why-kiefer-built/cost-of-ownership",
    ]);
  });

  it("adds sourced comparison content to the SIPs page", () => {
    const comparison = publicPages.sips.sections?.find((section) => section.comparison)?.comparison;
    expect(comparison?.rows).toHaveLength(3);
    expect(comparison?.rows.map((row) => row.sourceId)).toEqual([9, 3, 4]);
  });

  it("configures the supplied homeowner guide download", () => {
    expect(publicPages.whyKieferBuilt.guideDownload?.href).toBe(
      "/guides/kiefer-built-homeowner-guide.pdf",
    );
    expect(publicPages.costOfOwnership.guideDownload?.href).toBe(
      "/guides/kiefer-built-homeowner-guide.pdf",
    );

    const guidePath = join(process.cwd(), "public", "guides", "kiefer-built-homeowner-guide.pdf");
    expect(existsSync(guidePath)).toBe(true);
    expect(statSync(guidePath).size).toBeLessThanOrEqual(15 * 1024 * 1024);
  });

  it("teases the education hub from the services page", () => {
    const cards = publicPages.services.cards ?? [];
    const teaser = cards.find((card) => card.href === "/why-kiefer-built");
    expect(teaser, "services page should link to the education hub").toBeDefined();
  });
});
