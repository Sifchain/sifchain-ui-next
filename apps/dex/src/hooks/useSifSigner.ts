import { useSigner } from "@sifchain/cosmos-connect";
import { invariant } from "@sifchain/ui";
import { useQuery } from "@tanstack/react-query";
import { useDexEnvironment } from "~/domains/core/envs";

export function useSifSigner() {
  const { data: env } = useDexEnvironment();
  return useSigner(env?.sifChainId ?? "", { enabled: env !== undefined });
}

export function useSifSignerAddress() {
  const { signer } = useSifSigner();

  return useQuery(
    ["sifchain-signer-address"],
    async () => {
      invariant(signer !== undefined, "Sif signer is not defined");

      const accounts = await signer?.getAccounts();

      return accounts?.[0]?.address ?? "";
    },
    {
      enabled: signer !== undefined,
    },
  );
}
