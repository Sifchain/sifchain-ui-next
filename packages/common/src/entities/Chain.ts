import { ChainInfo } from "@keplr-wallet/types";

import { IAsset } from "./Asset";
import { NetworkKind } from "./Network";

export type BaseChainConfig = {
  network: NetworkKind;
  hidden?: boolean;
  displayName: string;
  blockExplorerUrl: string;
  nativeAssetSymbol: string;
  underMaintenance?: boolean;
};
export type EthChainConfig = BaseChainConfig & {
  chainType: "eth";
  chainId: number;
  blockExplorerApiUrl: string;
};
export type IBCChainConfig = BaseChainConfig & {
  chainType: "ibc";
  chainId: string;
  rpcUrl: string;
  restUrl: string;
  keplrChainInfo: ChainInfo;
  denomTracesPath?: string;
  features?: {
    erc20Transfers: boolean;
  };
};

export type ChainConfig = IBCChainConfig | EthChainConfig;

export type NetworkChainConfigLookup = Record<NetworkKind, ChainConfig>;

export interface Chain {
  chainConfig: ChainConfig;
  network: NetworkKind;
  displayName: string;
  nativeAsset: IAsset;
  assets: IAsset[];
  assetMap: Map<string, IAsset>;
  forceGetAsset: (symbol: string) => IAsset;
  lookupAsset(symbol: string): IAsset | undefined;
  lookupAssetOrThrow(symbol: string): IAsset;
  findAssetWithLikeSymbol(symbol: string): IAsset | undefined;
  findAssetWithLikeSymbolOrThrow(symbol: string): IAsset;
  getBlockExplorerUrlForTxHash(hash: string): string;
  getBlockExplorerUrlForAddress(hash: string): string;
}
