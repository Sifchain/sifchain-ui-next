import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";

import { STARNAME_TESTNET } from "./starname-testnet";
import { STARNAME_MAINNET } from "./starname-mainnet";
export default <NetEnvChainConfigLookup>{
  localnet: STARNAME_TESTNET,
  devnet: STARNAME_TESTNET,
  testnet: STARNAME_TESTNET,
  mainnet: STARNAME_MAINNET,
};
