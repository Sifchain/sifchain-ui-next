import { NetworkKind } from "~/entities";
import { AppCookies } from "./AppCookies";

export type NetworkEnv = "localnet" | "devnet" | "testnet" | "mainnet" | "tempnet";

export const NETWORK_ENVS: Set<NetworkEnv> = new Set<NetworkEnv>([
  "localnet",
  "devnet",
  "testnet",
  "mainnet",
  "tempnet",
]);

type AssetTag = `${NetworkKind}.${NetworkEnv}`;

type EnvProfileConfig = {
  kind: NetworkEnv;
  ethAssetTag: AssetTag;
  sifAssetTag: AssetTag;
  cosmoshubAssetTag: AssetTag;
};

export const PROFILE_LOOKUP: Record<NetworkEnv, EnvProfileConfig> = {
  mainnet: {
    kind: "mainnet",
    ethAssetTag: "ethereum.mainnet",
    sifAssetTag: "sifchain.mainnet",
    cosmoshubAssetTag: "cosmoshub.mainnet",
  },
  testnet: {
    kind: "testnet",
    ethAssetTag: "ethereum.testnet",
    sifAssetTag: "sifchain.testnet",
    cosmoshubAssetTag: "cosmoshub.testnet",
  },
  devnet: {
    kind: "devnet",
    ethAssetTag: "ethereum.devnet",
    sifAssetTag: "sifchain.devnet",
    cosmoshubAssetTag: "cosmoshub.testnet",
  },
  tempnet: {
    kind: "tempnet",
    ethAssetTag: "ethereum.testnet",
    sifAssetTag: "sifchain.testnet",
    cosmoshubAssetTag: "cosmoshub.testnet",
  },
  localnet: {
    kind: "localnet",
    ethAssetTag: "ethereum.localnet",
    sifAssetTag: "sifchain.localnet",
    cosmoshubAssetTag: "cosmoshub.testnet",
  },
} as const;

export type HostConfig = {
  pattern: RegExp;
  networkEnv: NetworkEnv;
};

// Here we list hostnames that have default env settings
const hostDefaultEnvs: HostConfig[] = [
  { pattern: /dex\.sifchain\.finance$/, networkEnv: "mainnet" },
  { pattern: /testnet\.sifchain\.finance$/, networkEnv: "testnet" },
  { pattern: /devnet\.sifchain\.finance$/, networkEnv: "devnet" },
  { pattern: /sifchain\.vercel\.app$/, networkEnv: "devnet" },
  { pattern: /gateway\.pinata\.cloud$/, networkEnv: "devnet" },
  { pattern: /localhost$/, networkEnv: "devnet" },
];

export function getNetworkEnv(hostname: string) {
  for (const { pattern, networkEnv: net } of hostDefaultEnvs) {
    if (pattern.test(hostname)) {
      return net;
    }
  }
  return null;
}

export function isNetworkEnvSymbol(a: any): a is NetworkEnv {
  return NETWORK_ENVS.has(a);
}

type GetEnvArgs = {
  location: { hostname: string };
  cookies?: Pick<AppCookies, "getEnv">;
};

export function getEnv({ location: { hostname }, cookies = AppCookies() }: GetEnvArgs) {
  const cookieEnv = cookies.getEnv();

  const sifEnv = isNetworkEnvSymbol(cookieEnv) ? cookieEnv : getNetworkEnv(hostname);

  if (sifEnv != null && PROFILE_LOOKUP[sifEnv]) {
    return PROFILE_LOOKUP[sifEnv];
  }

  console.error(new Error(`Cannot render environment ${sifEnv} ${cookieEnv}`));

  return PROFILE_LOOKUP["mainnet"];
}
