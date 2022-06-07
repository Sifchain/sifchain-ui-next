export type NetworkKind =
  | "sifchain"
  | "ethereum"
  // The rest... sort by name
  | "akash"
  | "band"
  | "bitsong"
  | "cerberus"
  | "chihuahua"
  | "comdex"
  | "cosmoshub"
  | "crypto-org"
  | "emoney"
  | "evmos"
  | "gravity"
  | "iris"
  | "ixo"
  | "juno"
  | "ki"
  | "likecoin"
  | "osmosis"
  | "persistence"
  | "regen"
  | "starname"
  | "sentinel"
  | "stargaze"
  | "secret"
  | "terra";

export const ACTIVE_NETWORKS = new Set<NetworkKind>([
  "sifchain",
  "ethereum",
  // The rest... sort by name
  "akash",
  "band",
  "bitsong",
  "cerberus",
  "chihuahua",
  "comdex",
  "cosmoshub",
  "crypto-org",
  "emoney",
  "evmos",
  "gravity",
  "iris",
  "ixo",
  "juno",
  "ki",
  "likecoin",
  "osmosis",
  "persistence",
  "regen",
  "starname",
  "sentinel",
  "stargaze",
  "secret",
  "terra",
]);
