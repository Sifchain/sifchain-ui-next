import { NetEnvChainConfigLookup } from "../NetEnvChainConfigLookup";

import { SECRET_MAINNET } from "./secret-mainnet";

export default <NetEnvChainConfigLookup>{
  localnet: SECRET_MAINNET,
  devnet: SECRET_MAINNET,
  testnet: SECRET_MAINNET,
  mainnet: SECRET_MAINNET,
};
