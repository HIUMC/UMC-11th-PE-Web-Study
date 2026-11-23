import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // TMDB 포스터/배경 이미지를 next/image로 최적화하려면 허용 목록에 등록해야 한다
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
