import { EthChainConfig } from "../../../entities";

export const ETHEREUM_MAINNET: EthChainConfig = {
  chainType: "eth",
  chainId: "0x1", // mainnet
  network: "ethereum",
  displayName: "Ethereum",
  blockExplorerUrl: "https://etherscan.io",
  blockExplorerApiUrl: "https://api.etherscan.io",
  nativeAssetSymbol: "eth",
};
