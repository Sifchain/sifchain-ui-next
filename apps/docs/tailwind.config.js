module.exports = {
  preset: [require("@sifchain/ui/tailwind.config.preset.js")],
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
