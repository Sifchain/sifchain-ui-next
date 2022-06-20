const sifchainPreset = require("@sifchain/ui/tailwind.config.preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  presets: [sifchainPreset],
  content: [
    "./public/**/*.html",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/layouts/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/compounds/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        sidebar: "280px",
      },
      backgroundImage: (theme) => ({
        forest: "url(/img/forest.webp)",
      }),
    },
  },
  plugins: [],
};
