const nextTranspileModules = require("next-transpile-modules");
const withTM = nextTranspileModules(["@sifchain/ui"]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withTM(nextConfig);
