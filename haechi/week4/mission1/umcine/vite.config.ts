import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // TanStack Router 플러그인은 React 플러그인보다 앞에 둬요.
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
});
