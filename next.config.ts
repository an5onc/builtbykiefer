import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cap generated variants at 1920px — full-bleed marketing imagery doesn't need 4K renditions
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;
