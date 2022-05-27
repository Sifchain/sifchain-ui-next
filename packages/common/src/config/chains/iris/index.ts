import { IRIS_TESTNET } from "./iris-testnet";
import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";
import { IRIS_MAINNET } from "./iris-mainnet";

export default <NetEnvChainConfigLookup>{
  localnet: IRIS_TESTNET,
  devnet: IRIS_TESTNET,
  testnet: IRIS_TESTNET,
  mainnet: IRIS_MAINNET,
};
