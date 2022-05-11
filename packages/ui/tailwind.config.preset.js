/**
 * @type {import("tailwindcss/tailwind-config").TailwindConfig}
 */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "accent-gradient": `linear-gradient(180deg, #D4B553 0%, #C1A04F 100%);`,
      },
      screens: {
        shorter: {
          raw: "(max-height: 900px)",
        },
      },
      fontFamily: {
        DEFAULT: "sans",
        sans: [
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          "sans-serif",
        ],
        mono: [
          '"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New"',
          "monospace",
        ],
        noatan: ["Noatan"],
      },
      spacing: {
        sidebar: SIDEBAR_WIDTH,
      },
      width: {
        sidebar: SIDEBAR_WIDTH,
      },
      inset: {
        sidebar: SIDEBAR_WIDTH,
      },
      colors: {
        white: "#e6e6e6",
        black: "rgb(12, 17, 19)",
        sifgray: {
          sif50: "#F8F9FC",
          sif100: "#EDEFF5",
          sif200: "#CFD3DD",
          sif300: "#9699A5",
          sif600: "#484C5A",
          sif700: "#2A2D39",
          sif750: "#2A2D39",
          sif800: "#21242F",
          sif850: "#10131C",
          sif900: "#0A0E17",
        },
        green: {
          sif400: "#4ADE80",
        },
      },
      animation: {
        "fade-in": "fadeIn 150ms ease-out 1",
        "fade-in-up": "fadeInUp 200ms ease-out 1",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(1%) scale(1)" },
          "100%": { opacity: "1", transform: "translateY(0%) scale(1)" },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
