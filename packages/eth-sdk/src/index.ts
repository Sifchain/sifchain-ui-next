import type { Signer } from "ethers";
import mainnetPeggyBridgeBankAbi from "./eth-sdk/abis/mainnet/peggy/bridgeBank.json";
import { getContract, MainnetSdk } from "./generated";

export * from "./generated";

// temporary solution since testnet and devnet contracts are not verified
// we assume it's the same as mainnet

export const getTestnetSdk = (defaultSigner: Signer): MainnetSdk => ({
  peggy: {
    bridgeBank: getContract(
      "0x6CfD69783E3fFb44CBaaFF7F509a4fcF0d8e2835",
      mainnetPeggyBridgeBankAbi,
      defaultSigner,
    ),
  },
});

export const getDevnetSdk = (defaultSigner: Signer): MainnetSdk => ({
  peggy: {
    bridgeBank: getContract(
      "0x96DC6f02C66Bbf2dfbA934b8DafE7B2c08715A73",
      mainnetPeggyBridgeBankAbi,
      defaultSigner,
    ),
  },
});
