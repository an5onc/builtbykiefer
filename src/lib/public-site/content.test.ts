import { describe, expect, it } from "vitest";
import { publicPages } from "./content";

describe("public site content", () => {
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
