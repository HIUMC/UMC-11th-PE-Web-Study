import next from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  ...next,
  ...nextTypescript,
  globalIgnores([".next/**", "next-env.d.ts", "dist/**", ".tanstack/**"]),
]);
