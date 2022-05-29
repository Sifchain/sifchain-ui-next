import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { ETHEREUM_TESTNET } from "./ethereum-testnet";
import { ETHEREUM_MAINNET } from "./ethereum-mainnet";

export default <NetEnvChainConfigLookup>{
  devnet: ETHEREUM_TESTNET,
  testnet: ETHEREUM_TESTNET,
  localnet: ETHEREUM_TESTNET,
  mainnet: ETHEREUM_MAINNET,
};
