import { getDevnetSdk, getMainnetSdk, getTestnetSdk } from "@sifchain/evm";
import { invariant } from "@sifchain/ui";
import type { Signer } from "ethers";
import { useSigner } from "wagmi";
import { useDexEnvKind } from "~/domains/core/envs";
import { useQueryWithNonQueryKeyDeps } from "./useQueryWithNonSerializableDeps";

const useEvmSdk = () => {
  const environment = useDexEnvKind();
  const {
    data: signer,
    internal: { dataUpdatedAt: signerUpdatedAt },
  } = useSigner();

  return useQueryWithNonQueryKeyDeps(
    ["evm-sdk", environment],
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
    [signerUpdatedAt],
  );
};

export default useEvmSdk;
