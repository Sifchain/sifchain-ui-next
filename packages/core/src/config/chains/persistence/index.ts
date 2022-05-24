import { PERSISTENCE_TESTNET } from "./persistence-testnet";
import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { PERSISTENCE_MAINNET } from "./persistence-mainnet";

export default <NetEnvChainConfigLookup>{
  localnet: PERSISTENCE_TESTNET,
  devnet: PERSISTENCE_TESTNET,
  testnet: PERSISTENCE_TESTNET,
  mainnet: PERSISTENCE_MAINNET,
};
