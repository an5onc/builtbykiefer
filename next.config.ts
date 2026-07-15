import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Land Lead Finder uploads county CSV extracts through a Server Action;
    // the default 1MB body limit is too small for assessor exports.
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
};

export default nextConfig;
