/// <reference types="vitest/config" />

import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  base: "/trackuler/",
  server: {
    port: 7776,
  },
  build: {
    outDir: "build",
    sourcemap: true, // build "*.map" files for JS sources
    manifest: false, // create a manifest.json for further processing of generated assets
  },
  test: {
    environment: "jsdom",
  },
});
