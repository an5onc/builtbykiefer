import { describe, expect, it } from "vitest";
import { publicPages } from "./content";

describe("public site content", () => {
  it("markets custom elevators with the new project-4 imagery", () => {
    const servicesCards = publicPages.services.cards ?? [];
    const renovationCards = publicPages.renovations.cards ?? [];
    const renovationSections = publicPages.renovations.sections ?? [];

    const serviceCard = servicesCards.find((card) => card.title === "Custom Elevators");
    const renovationCard = renovationCards.find((card) => card.title === "Custom Elevators");
    const elevatorSection = renovationSections.find((section) => section.title.includes("Custom elevators"));

    expect(serviceCard).toBeDefined();
    expect(renovationCard).toBeDefined();
    expect(elevatorSection).toBeDefined();
    expect(serviceCard?.image).toContain("/images/project-4/");
    expect(renovationCard?.image).toContain("/images/project-4/");
    expect(elevatorSection?.body).toContain("designers");
    expect((elevatorSection as { id?: string } | undefined)?.id).toBe("custom-elevators");
  });
});
