import { useSigner } from "@sifchain/cosmos-connect";
import { invariant } from "@sifchain/ui";
import { useQuery, QueryObserverOptions } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";

function useSifSigner() {
  const { data: env } = useDexEnvironment();
  return useSigner(env?.sifChainId ?? "", { enabled: env !== undefined });
}

export function useSifSignerAddress(options?: { enabled: boolean }) {
  const { signer } = useSifSigner();
  const customOptions = options ?? { enabled: signer !== undefined };

  return useQuery(
    "sifchain-signer-address",
    async () => {
      if (signer) {
        const accounts = await signer?.getAccounts();

        return accounts?.[0]?.address;
      }

      console.error("Sif signer is not defined");
      return "";
    },
    customOptions,
  );
}

export default useSifSigner;
