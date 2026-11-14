import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import nextConfig from "../../../next.config";
import redirects from "./legacy-redirects.json";
import { publicRoutes, noindexRoutes } from "./routes";
import { createMarketingMetadata } from "./metadata";
import { businessContact } from "./business";
import { mountainVideo } from "./project-video";

describe("client domain migration", () => {
  it("publishes only retained canonical client URLs in sitemap and robots", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual(publicRoutes.map((path) => `https://kbuiltco.com${path === "/" ? "/" : path}`));
    for (const path of noindexRoutes) expect(urls).not.toContain(`https://kbuiltco.com${path}`);
    const robots = readFileSync("public/robots.txt", "utf8");
    expect(robots).toContain("Sitemap: https://kbuiltco.com/sitemap.xml");
    expect(robots).toContain("Disallow: /api/");
    expect(robots).not.toContain("builtbykiefer.com");
  });

  it("keeps page metadata paths relative to the shared base and uses the client identity", () => {
    const metadata = createMarketingMetadata({ title: "Services", description: "Construction services", pathname: "/services", image: "/og-image.jpg", imageAlt: "Home" });
    expect(metadata.alternates?.canonical).toBe("/services");
    expect(metadata.openGraph).toMatchObject({ url: "/services", siteName: "Kiefer Built Contracting" });
  });

  it("installs exact permanent redirects without intercepting retained pages or inventing portals", async () => {
    const rules = await nextConfig.redirects?.();
    expect(rules).toHaveLength(Object.keys(redirects).length);
    expect(rules).toContainEqual({ source: "/about/careers", destination: "/careers", permanent: true });
    expect(rules).toContainEqual({ source: "/renovations-and-additions/elevators", destination: "/services/custom-elevators", permanent: true });
    const retained = [...publicRoutes, ...noindexRoutes] as string[];
    const selectedAssets: Record<string, string> = {
      "/guides/kiefer-built-homeowner-guide.pdf": "/guides/kiefer-built-homeowner-guide-2026.pdf",
      "/images/project-2/build-timelapse.mp4": mountainVideo.source,
    };
    for (const [source, destination] of Object.entries(redirects)) {
      expect(retained).not.toContain(source);
      expect(destination === "/sitemap.xml" || retained.includes(destination) || selectedAssets[source] === destination || (source === "/buildertrend" && destination === "https://buildertrend.net/app/Login"), `${source} must resolve to a retained destination, selected asset or the explicit external login`).toBe(true);
      expect(destination).not.toBe("/");
      expect(source).not.toMatch(/[:*?]/);
      expect(Object.hasOwn(redirects, destination), `${source} must not create a redirect chain`).toBe(false);
    }
    expect(redirects["/buildertrend"]).toBe(businessContact.clientLogin);
    expect(businessContact.clientLogin).toBe("https://buildertrend.net/app/Login");
    expect(Object.keys(redirects)).not.toContain("/privacy-policy");
    expect(publicRoutes).toContain("/privacy-policy");
  });
});
