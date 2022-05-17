export const ENDPOINTS = {
  mainnet: "https://data.sifchain.finance/beta",
  testnet: "https://data.sifchain.finance/beta",
  devnet: "https://data.sifchain.finance/beta",
  localnet: "https://data.sifchain.finance/beta",
};

export type EvnKind = keyof typeof ENDPOINTS;
