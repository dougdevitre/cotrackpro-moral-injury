/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Static SPA. Adjust `base` if hosting under a sub-path (e.g. "/moral-injury/").
  base: "/",
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],
  },
});
