import { TERRA_TESTNET } from "./terra-testnet";
import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { TERRA_MAINNET } from "./terra-mainnet";

export default <NetEnvChainConfigLookup>{
  localnet: TERRA_TESTNET,
  devnet: TERRA_TESTNET,
  testnet: TERRA_TESTNET,
  mainnet: TERRA_MAINNET,
};
