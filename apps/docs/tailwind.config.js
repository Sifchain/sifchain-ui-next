const sifchainPreset = require("@sifchain/ui/tailwind.config.preset");

/**
 * @type {import("tailwindcss/tailwind-config").TailwindConfig}
 */
module.exports = {
  presets: [sifchainPreset],
  content: [
    "./theme.config.js",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
