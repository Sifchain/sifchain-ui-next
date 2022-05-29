import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { LIKECOIN_MAINNET } from "./likecoin-mainnet";
import { LIKECOIN_TESTNET } from "./likecoin-testnet";

export default <NetEnvChainConfigLookup>{
  localnet: LIKECOIN_TESTNET,
  devnet: LIKECOIN_TESTNET,
  testnet: LIKECOIN_TESTNET,
  mainnet: LIKECOIN_MAINNET,
};
