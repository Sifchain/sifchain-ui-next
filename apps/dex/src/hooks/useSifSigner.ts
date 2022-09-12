import { useConnectionUpdatedAt, useSigner } from "@sifchain/cosmos-connect";
import { invariant } from "@sifchain/ui";
import { useDexEnvironment, useDexEnvKind } from "~/domains/core/envs";
import { useQueryWithNonQueryKeyDeps } from "./useQueryWithNonSerializableDeps";

export function useSifSigner() {
  const { data: env } = useDexEnvironment();
  return useSigner(env?.sifChainId ?? "", { enabled: env !== undefined });
}

export function useSifSignerAddressQuery() {
  const { signer } = useSifSigner();
  const connectionUpdatedAt = useConnectionUpdatedAt();
  const dexEnv = useDexEnvKind();

  const query = useQueryWithNonQueryKeyDeps(
    [
      "sifchain-signer-address",
      {
        dexEnv,
      },
    ],
    async () => {
      invariant(signer !== undefined, "Sif signer is not defined");

      const accounts = await signer.getAccounts();

      return accounts?.[0]?.address ?? "";
    },
    {
      enabled: signer !== undefined,
    },
    [connectionUpdatedAt],
  );

  return query;
}
