import { NetworkKind } from "../entities";
import { AppCookies } from "./AppCookies";

export type NetworkEnv = "localnet" | "devnet" | "testnet" | "mainnet";

export const NETWORK_ENVS: NetworkEnv[] = [
  "localnet",
  "devnet",
  "testnet",
  "mainnet",
];

type AssetTag = `${NetworkKind}.${NetworkEnv}`;

type ProfileLookup = Record<
  NetworkEnv | number,
  {
    tag: NetworkEnv;
    ethAssetTag: AssetTag;
    sifAssetTag: AssetTag;
    cosmoshubAssetTag: AssetTag;
  }
>;

export const profileLookup: ProfileLookup = {
  mainnet: {
    tag: "mainnet",
    ethAssetTag: "ethereum.mainnet",
    sifAssetTag: "sifchain.mainnet",
    cosmoshubAssetTag: "cosmoshub.mainnet",
  },
  testnet: {
    tag: "testnet",
    ethAssetTag: "ethereum.testnet",
    sifAssetTag: "sifchain.devnet",
    cosmoshubAssetTag: "cosmoshub.testnet",
  },
  devnet: {
    tag: "devnet",
    ethAssetTag: "ethereum.devnet",
    sifAssetTag: "sifchain.devnet",
    cosmoshubAssetTag: "cosmoshub.testnet",
  },
  localnet: {
    tag: "localnet",
    ethAssetTag: "ethereum.localnet",
    sifAssetTag: "sifchain.localnet",
    cosmoshubAssetTag: "cosmoshub.testnet",
  },
} as const;

type HostConfig = {
  test: RegExp;
  net: NetworkEnv;
};

// Here we list hostnames that have default env settings
const hostDefaultEnvs: HostConfig[] = [
  { test: /dex\.sifchain\.finance$/, net: "mainnet" },
  { test: /testnet\.sifchain\.finance$/, net: "testnet" },
  { test: /devnet\.sifchain\.finance$/, net: "devnet" },
  { test: /sifchain\.vercel\.app$/, net: "devnet" },
  { test: /gateway\.pinata\.cloud$/, net: "devnet" },
  { test: /localhost$/, net: "devnet" },
];

export function getNetworkEnv(hostname: string) {
  for (const { test, net } of hostDefaultEnvs) {
    if (test.test(hostname)) {
      return net;
    }
  }
  return null;
}

export function isNetworkEnvSymbol(a: any): a is NetworkEnv {
  return NETWORK_ENVS.includes(a);
}

type GetEnvArgs = {
  location: { hostname: string };
  cookies?: Pick<AppCookies, "getEnv">;
};

export function getEnv({
  location: { hostname },
  cookies = AppCookies(),
}: GetEnvArgs) {
  const cookieEnv = cookies.getEnv();
  const defaultNetworkEnv = getNetworkEnv(hostname);

  let sifEnv: NetworkEnv | null;

  if (isNetworkEnvSymbol(cookieEnv)) {
    sifEnv = cookieEnv;
  } else {
    sifEnv = defaultNetworkEnv;
  }

  if (sifEnv != null && profileLookup[sifEnv]) {
    return profileLookup[sifEnv];
  }

  console.error(new Error(`Cannot render environment ${sifEnv} ${cookieEnv}`));

  return profileLookup["mainnet"];
}
