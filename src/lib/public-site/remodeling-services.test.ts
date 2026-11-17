import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { remodelingServices } from "./remodeling-services";
import ServiceLandingPage from "@/components/public-site/ServiceLandingPage";
import ServicesPage from "@/app/services/page";
import { publicRoutes } from "./routes";
import { parseQuoteRequestPayload } from "@/lib/contact/quote-request";
import { formatQuoteRequestEmail } from "@/lib/contact/quote-email";

vi.mock("next/navigation", () => ({ usePathname: () => "/services", useRouter: () => ({ push: vi.fn() }) }));

describe("dedicated service landing paths", () => {
  it.each(remodelingServices)("renders an actionable $title page with real proof and a valid short-form payload", (service) => {
    expect(publicRoutes).toContain(`/services/${service.slug}`);
    for (const photo of [service.hero, ...service.photos]) expect(existsSync(join(process.cwd(), "public", photo.src))).toBe(true);
    const html = renderToStaticMarkup(createElement(ServiceLandingPage, { service }));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('href="#contact"'); expect(html).toContain('id="contact"');
    expect(html).toContain('name="projectType"'); expect(html).toContain(`value="${service.projectType}" selected=""`);
    expect(html).toContain('type="hidden" name="budget" value="Still planning"');
    expect(html).toContain('type="hidden" name="timeline" value="Still planning"');
    expect(html).toContain('action="/api/quote-request"'); expect(html).toContain(service.projectLink);
    expect(html).toContain(service.testimonial.name); expect(html).toContain("Summary of customer feedback");
    const figures = [...html.matchAll(/<figure\b[^>]*>([\s\S]*?)<\/figure>/g)].map((match) => match[1]);
    for (const [index, photo] of [service.hero, ...service.photos].entries()) {
      expect(figures[index]).toContain(`href="${photo.project.href}"`);
      expect(figures[index]).toContain(photo.project.name);
      expect(figures[index]).toContain(photo.project.context);
    }
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1]);
    expect(schema).toMatchObject({ "@type": "Service", name: service.title, url: `https://kbuiltco.com/services/${service.slug}` });
    expect(schema.areaServed).toHaveLength(7);
    const payload = { name: "Fictional Client", email: "fixture@example.com", phone: "9705550100", projectType: service.projectType, location: "Windsor", budget: "Still planning", timeline: "Still planning", message: "A fictional renovation inquiry for a local test.", company: "" };
    expect(parseQuoteRequestPayload(payload).success).toBe(true);
    expect(formatQuoteRequestEmail(payload).text).toContain(`Project type: ${service.projectType}`);
  });
  it("uses photos verified against their credited source project", () => {
    const sources: Record<string, string> = {
      "/projects/lakehouse-remodel": "src/lib/public-site/lakehouse-remodel.ts",
      "/projects/timnath": "src/lib/public-site/timnath.ts",
      "/projects/red-feather-lakes": "src/lib/public-site/red-feather-lakes.ts",
      "/projects/greeley": "src/lib/public-site/greeley.ts",
    };
    for (const service of remodelingServices) {
      expect(new Set(service.photos.map((photo) => photo.project.href)).size).toBe(service.slug === "basement-remodeling" ? 3 : 4);
      for (const photo of [service.hero, ...service.photos]) {
        expect(publicRoutes).toContain(photo.project.href);
        expect(readFileSync(join(process.cwd(), sources[photo.project.href]), "utf8")).toContain(photo.src);
      }
    }
  });
  it("has a dedicated section/link per service and removes only the superseded content links", () => {
    const html = renderToStaticMarkup(createElement(ServicesPage));
    const main = html.match(/<main\b[\s\S]*?<\/main>/)![0];
    for (const service of remodelingServices) {
      expect(main).toContain(`id="${service.slug}"`);
      expect(main).toContain(`href="/services/${service.slug}"`);
    }
    expect(main).not.toContain('href="/projects/renovations-additions"');
    expect(main).not.toContain('href="/why-kiefer-built"');
    for (const href of ["/services/home-building", "/services/custom-elevators", "/projects/commercial"]) expect(main).toContain(`href="${href}"`);
  });
  it("keeps five owner-selected basement photos and removes the unrelated interiors", () => {
    const basement = remodelingServices.find((entry) => entry.slug === "basement-remodeling")!;
    expect(basement.photos).toHaveLength(5);
    expect(basement.photos.map((photo) => photo.src)).toEqual([
      "/images/timnath/basement-open-living-space.webp",
      "/images/project-3/basement-recreation-room.webp",
      "/images/timnath/updated-20261117/38-web-or-mls-IMG_0048.webp",
      "/images/red-feather-lakes/DSC00030.webp",
      "/images/timnath/updated-20261117/40-web-or-mls-IMG_0063.webp",
    ]);
    expect(basement.proofDescription).not.toMatch(/Lakehouse|bathroom finishes|finish inspiration/);
    expect(basement.testimonial.project).toBe("Basement finish");
  });});
