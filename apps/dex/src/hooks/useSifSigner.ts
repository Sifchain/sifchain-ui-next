import { useAccounts, useSigner } from "@sifchain/cosmos-connect";
import { useQuery } from "@tanstack/react-query";
import { useDexEnvironment } from "~/domains/core/envs";

export function useSifSigner() {
  const { data: env } = useDexEnvironment();
  return useSigner(env?.sifChainId ?? "", { enabled: env !== undefined });
}

export function useSifSignerAddressQuery() {
  const { data: env } = useDexEnvironment();
  const { accounts } = useAccounts(env?.sifChainId ?? "", { enabled: env !== undefined });

  return useQuery(["sifchain-signer-address", accounts], () => accounts?.[0]?.address);
}
