import { AKASH_TESTNET } from "./akash-testnet";
import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { AKASH_MAINNET } from "./akash-mainnet";

export default <NetEnvChainConfigLookup>{
  localnet: AKASH_TESTNET,
  devnet: AKASH_TESTNET,
  testnet: AKASH_TESTNET,
  mainnet: AKASH_MAINNET,
};
