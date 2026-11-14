import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { publicPages } from "./content";
import PublicPage from "@/components/public-site/PublicPage";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

function renderedImages(html: string) {
  const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "";
  return [...main.matchAll(/<img\b([^>]*)>/g)].map(([, attrs]) => {
    const source = attrs.match(/\bsrc="([^"]+)"/)?.[1]?.replaceAll("&amp;", "&") ?? "";
    const url = new URL(source, "http://127.0.0.1");
    return { image: url.searchParams.get("url") ?? url.pathname, alt: attrs.match(/\balt="([^"]*)"/)?.[1] };
  });
}

describe("shared public image descriptions", () => {
  it("requires an explicit description decision for every image-bearing card and section", () => {
    // No decorative exceptions are currently selected. Add a documented entry
    // here if a future reviewed image is intentionally assigned an empty alt.
    const decorativeImages = new Set<string>();
    let count = 0;
    for (const [key, page] of Object.entries(publicPages)) {
      for (const [kind, entries] of [["card", page.cards ?? []], ["section", page.sections ?? []]] as const) {
        entries.forEach((entry, index) => {
          if (!entry.image) return;
          count++;
          expect(entry.imageAlt, `${key}/${kind}/${index}`).toBeTypeOf("string");
          if (entry.imageAlt === "") expect(decorativeImages.has(`${key}/${kind}/${index}`)).toBe(true);
          else expect(entry.imageAlt?.trim().length).toBeGreaterThan(10);
          expect(entry.imageAlt).not.toMatch(/project photograph| by Kiefer Built Contracting$/);
        });
      }
    }
    expect(count).toBeGreaterThan(50);
  });

  it("renders the reviewed image descriptions across the entire shared catalog", () => {
    for (const content of Object.values(publicPages)) {
      const rendered = renderedImages(renderToStaticMarkup(createElement(PublicPage, { content })));
      // The wall comparison's layered renders are decorative; its role="img" wrapper carries the description.
      const featureLayers = rendered.filter(({ image }) => image.startsWith("/wall-comparison/"));
      expect(featureLayers.every(({ alt }) => alt === "")).toBe(true);
      expect(featureLayers.length > 0).toBe((content.sections ?? []).some((section) => section.feature === "wall-comparison"));
      const actual = rendered.filter(({ image }) => !image.startsWith("/wall-comparison/"));
      const expected = [
        { image: content.heroImage, alt: content.heroAlt },
        ...(content.cards ?? []).filter(card => card.image).map(card => ({ image: card.image, alt: card.imageAlt })),
        ...(content.sections ?? []).filter(section => section.image).map(section => ({ image: section.image, alt: section.imageAlt })),
      ];
      expect(actual).toEqual(expected);
    }
  });

  it("preserves intentional decorative empty alts without changing card link names", () => {
    const content = { ...publicPages.services, sections: [], cards: [
      { title: "Service details", description: "Read about the service.", href: "/services", image: "/images/project-3/exterior-twilight-front.jpg", imageAlt: "" },
    ] };
    const html = renderToStaticMarkup(createElement(PublicPage, { content }));
    expect(renderedImages(html).at(-1)?.alt).toBe("");
    expect(html).toContain('aria-label="Service details"');
  });
});

describe("public site content", () => {
  it("links supported New Builds examples without inventing a barn portfolio", () => {
    const cards = publicPages.newBuilds.cards ?? [];
    expect(cards.find((card) => card.title === "Space Efficient Homes")).toMatchObject({
      href: "/projects/contemporary-ranch", meta: "Home tour example: Contemporary Ranch",
    });
    expect(cards.find((card) => card.title === "Modern Homes")).toMatchObject({
      href: "/projects/mountain-modern", meta: "Home tour example: Mountain Modern",
    });
    expect(cards.find((card) => card.title === "Barns and Garages")?.href).toBeUndefined();
  });
  it("routes custom elevator marketing to the dedicated service page", () => {
    const servicesCards = publicPages.services.cards ?? [];
    const projectCards = publicPages.projects.cards ?? [];
    const renovationSections = publicPages.renovations.sections ?? [];

    const serviceCard = servicesCards.find((card) => card.title === "Custom Elevators");
    const projectCard = projectCards.find((card) => card.title === "Custom Elevator Renovation");
    const elevatorSection = renovationSections.find((section) => section.id === "custom-elevators");

    expect(serviceCard).toBeDefined();
    expect(projectCard).toBeDefined();
    expect(serviceCard?.image).toContain("/images/project-4/");
    expect(projectCard?.image).toContain("/images/project-4/");
    expect(serviceCard?.href).toBe("/services/custom-elevators");
    expect(projectCard?.href).toBe("/services/custom-elevators");
    expect(elevatorSection).toBeUndefined();
  });

  it("links both detailed home tours from the project gallery", () => {
    const hrefs = (publicPages.projects.cards ?? []).map((card) => card.href);

    expect(hrefs).toContain("/projects/contemporary-ranch");
    expect(hrefs).toContain("/projects/mountain-modern");
  });

  it("routes every journal card to a complete public destination", () => {
    const hrefs = (publicPages.blog.cards ?? []).map((card) => card.href);

    expect(hrefs).toEqual([
      "/why-kiefer-built/sips",
      "/why-kiefer-built/energy-efficiency",
      "/why-kiefer-built/indoor-air-quality",
      "/projects/mountain-modern",
    ]);
  });
});
