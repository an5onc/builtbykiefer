import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import ServiceAreasPage from "@/app/service-areas/page";
import { serviceAreaCities, serviceAreaCityList } from "./service-areas";
import { homeMetadata, localBusinessSchema } from "./seo";

vi.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({ push: vi.fn() }) }));
const expected = ["Windsor", "Fort Collins", "Loveland", "Greeley", "Timnath", "Johnstown", "Wellington"];

describe("consistent, qualified service-area facts", () => {
  it("preserves exactly the seven existing named locations without duplicates", () => {
    expect([...serviceAreaCities]).toEqual(expected);
    expect(new Set(serviceAreaCities).size).toBe(expected.length);
    expect(serviceAreaCityList).toBe("Windsor, Fort Collins, Loveland, Greeley, Timnath, Johnstown, and Wellington");
  });
  it("renders matching city cards and homepage labels with explicit project-fit confirmation", () => {
    const html = renderToStaticMarkup(createElement(ServiceAreasPage));
    const cityHeadings = [...html.matchAll(/<h2\b[^>]*>([^<]*)<\/h2>/g)].map((match) => match[1]).filter((name) => expected.includes(name));
    expect(cityHeadings).toEqual(expected);
    const home = renderToStaticMarkup(createElement(Home));
    for (const city of expected) {
      expect(home).toContain(`>${city}</p>`);
      expect(html).toContain(`Discuss a ${city} project`);
    }
    expect(html).toContain(`${expected.length} named`);
    expect(html).toContain("reviewed individually");
    expect(html).toContain("confirm project availability");
    expect(html).toContain('href="/#contact"');
    expect(html).not.toMatch(/miles from|drive times|Distance Guide|°[NW]|numerous custom builds|six core communities/i);
  });
  it("keeps schema city names consistent without inventing a business-location pin", () => {
    expect(localBusinessSchema.areaServed.map((area) => area.name)).toEqual(expected);
    expect(localBusinessSchema.address).toMatchObject({ addressLocality: "Windsor", addressRegion: "CO", addressCountry: "US" });
    expect(localBusinessSchema).not.toHaveProperty("geo");
    expect(homeMetadata.other).not.toHaveProperty("geo.position");
    expect(homeMetadata.other).not.toHaveProperty("ICBM");
  });
});
