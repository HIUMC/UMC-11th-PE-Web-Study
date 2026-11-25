import type { NextConfig } from "next";

const tailwindLoader = "@tailwindcss/turbopack";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: [tailwindLoader],
        as: "*.css",
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /[/\\]src[/\\]index\.css$/,
      enforce: "pre",
      use: tailwindLoader,
    });
    return config;
  },
};

export default nextConfig;
