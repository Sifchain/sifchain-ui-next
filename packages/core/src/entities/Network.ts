export type NetworkKind =
  | "sifchain"
  | "ethereum"
  // The rest... sort by name
  | "akash"
  | "band"
  | "cosmoshub"
  | "crypto-org"
  | "iris"
  | "ixo"
  | "juno"
  | "likecoin"
  | "osmosis"
  | "persistence"
  | "regen"
  | "sentinel"
  | "terra"
  | "emoney"
  | "evmos"
  | "starname"
  | "bitsong"
  | "cerberus"
  | "comdex"
  | "chihuahua"
  | "ki"
  | "stargaze"
  | "secret";

export const ACTIVE_NETWORKS = new Set<NetworkKind>([
  "sifchain",
  "ethereum",
  // The rest... sort by name
  "akash",
  "band",
  "cosmoshub",
  "crypto-org",
  "iris",
  "ixo",
  "juno",
  "likecoin",
  "osmosis",
  "persistence",
  "regen",
  "sentinel",
  "terra",
  "emoney",
  "evmos",
  "starname",
  "bitsong",
  "cerberus",
  "comdex",
  "chihuahua",
  "ki",
  "stargaze",
  "secret",
]);