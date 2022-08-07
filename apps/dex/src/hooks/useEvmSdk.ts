import { getDevnetSdk, getMainnetSdk, getTestnetSdk } from "@sifchain/evm";
import { invariant } from "@sifchain/ui";
import type { Signer } from "ethers";
import { useQuery } from "react-query";
import { useSigner } from "wagmi";

import { useDexEnvKind } from "~/domains/core/envs";

const useEvmSdk = () => {
  const environment = useDexEnvKind();
  const { data: signer } = useSigner();

  return useQuery(
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
  );
};

export default useEvmSdk;
