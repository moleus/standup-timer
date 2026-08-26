import type { NextConfig } from "next";

const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  assetPrefix: basePath,
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
