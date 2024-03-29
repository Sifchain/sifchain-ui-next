import type { BigNumberish, BytesLike, Signer } from "ethers";
import mainnetPeggyBridgeBankAbi from "./eth-sdk/abis/mainnet/peggy/bridgeBank.json";
import { getContract, getMainnetSdk as getBaseMainnetSdk, MainnetSdk } from "./generated";
import type { BridgeBank } from "./generated/esm/types";

export * from "./generated";

const enhanceSdk = (sdk: MainnetSdk) => ({
  ...sdk,
  peggy: {
    ...sdk.peggy,
    sendTokensToCosmos: async (recipient: BytesLike, token: string, amount: BigNumberish) => {
      const isBridgedToken = await sdk.peggy.bridgeBank.getCosmosTokenInWhiteList(token);

      return isBridgedToken
        ? sdk.peggy.bridgeBank.burn(recipient, token, amount)
        : sdk.peggy.bridgeBank.lock(recipient, token, amount);
    },
  },
});

export const getMainnetSdk = (defaultSigner: Signer) => enhanceSdk(getBaseMainnetSdk(defaultSigner));

// temporary solution since testnet and devnet contracts are not verified
// we assume it's the same as mainnet
export const getTestnetSdk = (defaultSigner: Signer) =>
  enhanceSdk({
    peggy: {
      bridgeBank: getContract(
        "0x0A7f48AF978A29B63F45e17095E3A6475bBAe1bB",
        mainnetPeggyBridgeBankAbi,
        defaultSigner,
      ) as BridgeBank,
    },
  });

export const getDevnetSdk = (defaultSigner: Signer) =>
  enhanceSdk({
    peggy: {
      bridgeBank: getContract(
        "0x0A7f48AF978A29B63F45e17095E3A6475bBAe1bB",
        mainnetPeggyBridgeBankAbi,
        defaultSigner,
      ) as BridgeBank,
    },
  });

export const getSdk = (defaultSigner: Signer, options: { bridgeBankContractAddress: string }) =>
  enhanceSdk({
    peggy: {
      bridgeBank: getContract(
        options.bridgeBankContractAddress,
        mainnetPeggyBridgeBankAbi,
        defaultSigner,
      ) as BridgeBank,
    },
  });
