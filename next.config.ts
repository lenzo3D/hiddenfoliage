import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Quality levels the image optimizer is allowed to serve.
    // 75 is the default; 85 is used for the hero still.
    qualities: [75, 85],
  },
};

export default nextConfig;
