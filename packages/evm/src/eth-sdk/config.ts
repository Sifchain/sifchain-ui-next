import { defineConfig } from "@dethcrypto/eth-sdk";

export default defineConfig({
  outputPath: "src/generated",
  contracts: {
    mainnet: {
      peggy: {
        bridgeBank: "0xB5F54ac4466f5ce7E0d8A5cB9FE7b8c0F35B7Ba8",
      },
    },
  },
});
