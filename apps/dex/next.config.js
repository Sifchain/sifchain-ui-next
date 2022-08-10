const nextTranspileModules = require("next-transpile-modules");
const withTM = nextTranspileModules(["@sifchain/ui", "@sifchain/utils"]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withTM(nextConfig);
