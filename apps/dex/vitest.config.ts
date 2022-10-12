/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
});
