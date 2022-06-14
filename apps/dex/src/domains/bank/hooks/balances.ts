import { useSigner } from "@sifchain/cosmos-connect";
import BigNumber from "bignumber.js";
import { useQuery } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useSifSigningStargateClient from "~/hooks/useSifSigningStargateClient";

export const useAllBalances = () => {
  const { data: env } = useDexEnvironment();
  const { signer } = useSigner(env?.sifChainId ?? "", {
    enabled: env?.sifChainId !== undefined,
  });
  const { data: signingStargateClient } = useSifSigningStargateClient();

  return useQuery(
    "all-balances",
    async () => {
      const accounts = await signer?.getAccounts();
      return signingStargateClient?.getAllBalances(
        accounts?.[0]?.address ?? "",
      );
    },
    { enabled: signer !== undefined && signingStargateClient !== undefined },
  );
};

export const useAllDisplayBalances = () => {
  const { data: balances } = useAllBalances();
  const { data: assets, indexedBySymbol } = useTokenRegistryQuery();

  return useQuery(
    "all-display-balances",
    async () => {
      return balances?.map((x) => {
        const tokenRecord = indexedBySymbol[x.denom];

        return {
          denom: tokenRecord?.displaySymbol ?? "",
          amount: new BigNumber(x.amount).shiftedBy(
            -(tokenRecord?.decimals ?? 0),
          ),
        };
      });
    },
    {
      enabled: balances !== undefined && assets !== undefined,
    },
  );
};
