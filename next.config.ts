import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/founding-ceo",
        destination: "/founding-ceo-position-search",
        permanent: true,
      },
      {
        source: "/founding-ceo/application",
        destination: "/founding-ceo-position-search/application",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
