import type { NextConfig } from "next";

// PAGES=1 produces the static GitHub Pages build (lenzo3d.github.io/hiddenfoliage):
// full export, no image optimizer, everything under the repo subpath. The normal
// build (dev, Vercel) is untouched.
const pages = process.env.PAGES === "1";

const nextConfig: NextConfig = {
  ...(pages ? { output: "export" as const, basePath: "/hiddenfoliage", trailingSlash: true } : {}),
  images: {
    // Quality levels the image optimizer is allowed to serve.
    // 75 is the default; 85 is used for the hero still.
    qualities: [75, 85],
    ...(pages ? { unoptimized: true } : {}),
  },
};

export default nextConfig;
