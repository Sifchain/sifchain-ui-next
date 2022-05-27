import { COSMOSHUB_TESTNET } from "./cosmoshub-testnet";
import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { COSMOSHUB_MAINNET } from "./cosmoshub-mainnet";

export default <NetEnvChainConfigLookup>{
  localnet: COSMOSHUB_TESTNET,
  devnet: COSMOSHUB_TESTNET,
  testnet: COSMOSHUB_TESTNET,
  mainnet: COSMOSHUB_MAINNET,
};
