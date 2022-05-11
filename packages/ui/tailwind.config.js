const sifchainPreset = require("./tailwind.config.preset");
/**
 * @type {import("tailwindcss/tailwind-config").TailwindConfig}
 */
module.exports = {
  presets: [sifchainPreset],
  content: ["./src/**/*.{jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
