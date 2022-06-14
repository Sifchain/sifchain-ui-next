import { useSigner } from "@sifchain/cosmos-connect";
import { useQuery } from "react-query";
import useSifSigningStargateClient from "~/hooks/useSifSigningStargateClient";

export const useAllBalances = () => {
  const { signer } = useSigner("sifchain-devnet-1");
  const { data: signingStargateClient } = useSifSigningStargateClient();

  return useQuery(
    "all-display-balances",
    async () => {
      const accounts = await signer?.getAccounts();
      return signingStargateClient?.getAllBalances(
        accounts?.[0]?.address ?? "",
      );
    },
    {
      enabled: signer !== undefined && signingStargateClient !== undefined,
    },
  );
};
