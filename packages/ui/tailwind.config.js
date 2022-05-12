/**
 * @type {import("tailwindcss/tailwind-config").TailwindConfig}
 */
module.exports = {
  presets: [require("./tailwind.config.preset")],
  content: ["./src/**/*.{jsx,tsx,mdx}"],
};
