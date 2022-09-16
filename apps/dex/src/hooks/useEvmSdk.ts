import { getDevnetSdk, getMainnetSdk, getTestnetSdk } from "@sifchain/evm";
import { invariant } from "@sifchain/ui";
import { useQuery } from "@tanstack/react-query";
import type { Signer } from "ethers";
import { useSigner } from "wagmi";
import { useDexEnvKind } from "~/domains/core/envs";

const useEvmSdk = () => {
  const environment = useDexEnvKind();
  const {
    data: signer,
    internal: { dataUpdatedAt: signerUpdatedAt },
  } = useSigner();

  return useQuery(
    ["evm-sdk", environment, signerUpdatedAt],
    () => {
      invariant(signer !== undefined, "signer is required");

      switch (environment) {
        case "devnet":
          return getDevnetSdk(signer as Signer);
        case "testnet":
          return getTestnetSdk(signer as Signer);
        default:
          return getMainnetSdk(signer as Signer);
      }
    },
    { enabled: signer !== undefined },
  );
};

export default useEvmSdk;
