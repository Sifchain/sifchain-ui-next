const withTM = require("next-transpile-modules")(["@sifchain/ui"]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.js",
  // optional: add `unstable_staticImage: true` to enable Nextra's auto image import
});

module.exports = withNextra(withTM(nextConfig));
