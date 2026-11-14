import type { NextConfig } from "next";
import legacyRedirects from "./src/lib/public-site/legacy-redirects.json";
import { publicSecurityHeaders } from "./src/lib/public-site/security-headers";

const nextConfig: NextConfig = {
  // npm/qualification run from the selected site, including retained bundles.
  // Do not infer a parent checkout from its additional lockfile.
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },
  async headers() {
    return [{ source: "/:path*", headers: publicSecurityHeaders(process.env.NODE_ENV === "development") }];
  },
  async redirects() {
    // Exact legacy client paths only. Domain redirects are activated separately at cutover.
    return Object.entries(legacyRedirects).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  images: {
    // Cap generated variants at 1920px — full-bleed marketing imagery doesn't need 4K renditions
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;
