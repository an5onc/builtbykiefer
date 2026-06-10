import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renovationShowcaseCategories } from "./renovations-showcase";

describe("renovations showcase content", () => {
  it("defines five interactive categories with real gallery images", () => {
    expect(renovationShowcaseCategories.map((category) => category.id)).toEqual([
      "kitchens",
      "bathrooms",
      "living-spaces",
      "exteriors",
      "custom-elevators",
    ]);

    for (const category of renovationShowcaseCategories) {
      expect(category.title).toBeTruthy();
      expect(category.shortLabel).toBeTruthy();
      expect(category.gallery.length).toBeGreaterThanOrEqual(3);
      expect(category.proofPoints.length).toBe(3);

      for (const item of category.gallery) {
        expect(item.src).toMatch(/^\/images\//);
        expect(item.alt).toContain("Kiefer Built");
        expect(existsSync(join(process.cwd(), "public", item.src))).toBe(true);
      }
    }
  });
});
