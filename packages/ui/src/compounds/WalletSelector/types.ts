import type { ReactNode } from "react";

export type ChainEntry = {
  id: string;
  name: string;
  type: string;
  icon: ReactNode;
  connected?: boolean;
  nativeAssetSymbol?: string;
  nativeAssetDecimals?: number;
  nativeAssetPrice?: string;
};

export type WalletEntry = {
  id: string;
  name: string;
  icon: ReactNode;
  type: string;
  isConnected?: boolean;
  account?: string;
};
