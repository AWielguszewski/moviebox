import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [35, 50, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "ia.media-imdb.com",
      },
    ],
  },
};

export default nextConfig;
