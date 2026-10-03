import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }), // route 화면 코드를 필요한 시점에 불러오도록 설정
    react(),
    tailwindcss(),
  ],
});