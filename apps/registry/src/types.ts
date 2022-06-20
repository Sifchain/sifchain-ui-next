export type AssetConfig = {
  name: string;
  symbol: string;
  displaySymbol: string;
  decimals: number;
  label?: string;
  imageUrl?: string;
  network: string;
  homeNetwork: string;
  address?: string;
};

export type ProviderConfig = {
  id: string;
  displayName: string;
  description: string;
  url: string;
  logoUrl: string;
  analyticsId: string;
};
