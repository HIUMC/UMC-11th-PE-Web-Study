import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
  // 작은 정적 SVG 아이콘은 그대로 내려받고, 영화 포스터/배경은 next/image로 최적화한다.
  {
    files: ["src/components/**/*.tsx", "src/screens/movies/movie-detail-page.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },
]);
