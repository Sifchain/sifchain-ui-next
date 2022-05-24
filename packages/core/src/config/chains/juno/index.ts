import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { JUNO_MAINNET } from "./juno-mainnet";
import { JUNO_TESTNET } from "./juno-testnet";

export default <NetEnvChainConfigLookup>{
  localnet: JUNO_TESTNET,
  devnet: JUNO_TESTNET,
  testnet: JUNO_TESTNET,
  mainnet: JUNO_MAINNET,
};
