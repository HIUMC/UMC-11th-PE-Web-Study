import type { NextConfig } from "next";
import { loadPreviousEnvironment } from "./scripts/load-previous-env.mjs";

loadPreviousEnvironment();

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**", search: "" },
    ],
  },
};

export default nextConfig;
