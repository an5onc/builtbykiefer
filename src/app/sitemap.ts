import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/public-site/routes";

const baseUrl = "https://www.builtbykiefer.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: new URL(route, baseUrl).toString(),
    changeFrequency: route === "/" || route === "/blog" ? "monthly" : "yearly",
    priority: route === "/" ? 1 : route.split("/").filter(Boolean).length === 1 ? 0.8 : 0.6,
  }));
}
