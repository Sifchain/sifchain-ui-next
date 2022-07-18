import type { ReactNode } from "react";

export type BaseChainEntry = {
  id: string;
  name: string;
  type: string;
  icon: ReactNode;
  connected?: boolean;
  nativeAssetSymbol?: string;
  nativeAssetDecimals?: number;
  nativeAssetPrice?: string;
};

export type IbcChainEntry = BaseChainEntry & {
  type: "ibc";
  chainId: string;
};

export type EvmChainEntry = BaseChainEntry & {
  type: "eth";
  chainId: number;
};

export type ChainEntry = IbcChainEntry | EvmChainEntry;

export type WalletEntry = {
  id: string;
  name: string;
  icon: ReactNode;
  type: string;
  isConnected?: boolean;
  account?: string;
};
