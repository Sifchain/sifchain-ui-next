import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  target: "esnext",
  clean: true,
  format: ["cjs", "esm"],
  env: {
    NODE_ENV: "production",
  },
  dts: true,
});
