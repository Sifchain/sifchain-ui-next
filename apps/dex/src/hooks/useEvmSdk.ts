import { getDevnetSdk, getMainnetSdk, getTestnetSdk } from "@sifchain/evm";
import { useQuery } from "react-query";
import { useSigner } from "wagmi";
import { useDexEnvKind } from "~/domains/core/envs";

const useEvmSdk = () => {
  const environment = useDexEnvKind();
  const { data: signer } = useSigner();

  return useQuery(
    ["evm-sdk", environment],
    () => {
      switch (environment) {
        case "devnet":
          return getDevnetSdk(signer!);
        case "testnet":
          return getTestnetSdk(signer!);
        case "mainnet":
        default:
          return getMainnetSdk(signer!);
      }
    },
    { enabled: signer !== undefined },
  );
};

export default useEvmSdk;
