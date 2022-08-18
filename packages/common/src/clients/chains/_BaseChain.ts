import { urlJoin } from "url-join-ts";
import { Chain, ChainConfig, IAsset } from "~/entities";
import { isLikeSymbol } from "~/utils/isLikeSymbol";

export type ChainContext = {
  assets: IAsset[];
  chainConfig: ChainConfig;
};

export class BaseChain implements Chain {
  get network() {
    return this.chainConfig.network;
  }
  get displayName() {
    return this.chainConfig.displayName;
  }

  chainConfig: ChainConfig;
  assets: IAsset[];
  assetMap: Map<string, IAsset>;
  nativeAsset: IAsset;

  constructor(public context: ChainContext) {
    this.chainConfig = context.chainConfig;

    this.assets = context.assets.filter((a) => a.network === context.chainConfig.network);

    this.assetMap = new Map();
    this.assets.forEach((asset) => {
      this.assetMap.set(asset.symbol.toLowerCase(), asset);
    });
    this.nativeAsset = this.assets.find(
      (a) => a.symbol.toLowerCase() === context.chainConfig.nativeAssetSymbol.toLowerCase(),
    ) as IAsset;
  }

  lookupAsset(symbol: string) {
    return this.assetMap.get(symbol.toLowerCase());
  }

  lookupAssetOrThrow(symbol: string) {
    const asset = this.lookupAsset(symbol);
    if (!asset) {
      throw new Error(`Asset with symbol ${symbol} not found in chain ${this.displayName}`);
    }
    return asset;
  }

  findAssetWithLikeSymbol(symbol: string) {
    return this.assets.find((asset) => isLikeSymbol(asset.symbol, symbol));
  }

  findAssetWithLikeSymbolOrThrow(symbol: string) {
    const asset = this.assets.find((asset) => isLikeSymbol(asset.symbol, symbol));
    if (!asset) throw new Error(`Asset ${symbol} not found in chain ${this.displayName}`);
    return asset;
  }

  getBlockExplorerUrlForTxHash(hash: string) {
    return urlJoin(this.chainConfig.blockExplorerUrl, "transactions", hash);
  }

  getBlockExplorerUrlForAddress(address: string) {
    return urlJoin(this.chainConfig.blockExplorerUrl, "accounts", address);
  }

  forceGetAsset(symbol: string) {
    return this.lookupAsset(symbol) || this.findAssetWithLikeSymbolOrThrow(symbol);
  }
}
