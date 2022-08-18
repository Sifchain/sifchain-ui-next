import type { ProviderConfig, AssetConfig } from "~/types";

type AssetList = {
  assets: AssetConfig[];
};

type ProviderList = {
  providers: ProviderConfig[];
};

export async function readAssetList(baseUrl: string, network: string, env: string) {
  const filePath = `${baseUrl}/config/networks/${network}/assets.${network}.${env}.json`;
  const response = await fetch(filePath).then((res) => res.json() as Promise<AssetList>);

  return response;
}

export async function readProviderList(baseUrl?: string) {
  const filePath = `${baseUrl}/config/providers/providers.json`;
  const response = await fetch(filePath).then((res) => res.json() as Promise<ProviderList>);

  return response;
}
