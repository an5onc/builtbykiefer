import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renovationShowcaseCategories } from "./renovations-showcase";
import { lakehousePhotos } from "./lakehouse-remodel";
import { publicPages } from "./content";
import { timnathPhotos } from "./timnath";

describe("renovations showcase content", () => {
  it("defines six interactive categories with real gallery images", () => {
    expect(renovationShowcaseCategories.map((category) => category.id)).toEqual([
      "kitchens",
      "bathrooms",
      "living-spaces",
      "speakeasies",
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

  it("places the Lakehouse renovation photos in matching sections and outside New Builds", () => {
    const expectedCategories: Record<string, string | undefined> = {
      kitchens: "Kitchen", bathrooms: "Baths", "living-spaces": "Living & Dining", exteriors: "Exterior",
    };
    for (const category of renovationShowcaseCategories) {
      const photos = category.gallery.filter((photo) => photo.src.startsWith("/images/lakehouse-remodel/"));
      expect(photos).toHaveLength(expectedCategories[category.id] ? 3 : 0);
      expect(new Set(category.gallery.map((photo) => photo.src)).size).toBe(category.gallery.length);
      for (const photo of photos) {
        expect(lakehousePhotos.find((item) => item.src === photo.src)?.category).toBe(expectedCategories[category.id]);
      }
    }
    expect(publicPages.newBuilds.cards?.some((card) => card.href === "/projects/lakehouse-remodel")).toBe(false);
    expect(publicPages.projects.cards?.some((card) => card.href === "/projects/lakehouse-remodel")).toBe(true);
  });

  it("uses the Timnath speakeasy photos for the new service", () => {
    expect(timnathPhotos.filter((photo) => photo.category === "Speakeasy")).toHaveLength(5);
    expect(JSON.stringify(timnathPhotos)).not.toMatch(/lounge/i);
    const service = renovationShowcaseCategories.find((category) => category.id === "speakeasies")!;
    expect(service.cta?.href).toBe("/projects/timnath");
    for (const photo of service.gallery) {
      expect(timnathPhotos.find((item) => item.src === photo.src)?.category).toBe("Speakeasy");
    }
  });
});
