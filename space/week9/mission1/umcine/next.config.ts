import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" }] },
  async rewrites() {
    const backend = (process.env.API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");
    return [{ source: "/api/backend/:path*", destination: `${backend}/:path*` }];
  },
};
export default nextConfig;
