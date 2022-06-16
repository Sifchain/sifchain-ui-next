import type { IAsset } from "@sifchain/common";
import { useSigner } from "@sifchain/cosmos-connect";
import type { Coin } from "@sifchain/proto-types/cosmos/base/coin";
import BigNumber from "bignumber.js";
import { useQuery } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";

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
  const {
    data: assets,
    indexedBySymbol,
    indexedByDisplaySymbol,
    indexedByIBCDenom,
  } = useTokenRegistryQuery();

  return useQuery(
    "all-display-balances",
    async () => {
      const records = balances
        ?.map((x) => {
          const tokenRecord =
            indexedBySymbol[x.denom.toLowerCase()] ||
            indexedByIBCDenom[x.denom] ||
            indexedByIBCDenom[x.denom.toLowerCase()] ||
            indexedByIBCDenom[x.denom.slice(1).toLowerCase()] ||
            indexedByDisplaySymbol[x.denom.toLowerCase()] ||
            indexedBySymbol[x.denom.slice(1).toLowerCase()];

          if (!tokenRecord) {
            console.warn("tokenRecord not found", x.denom);
            return;
          }

          return [tokenRecord, x] as const;
        })
        .filter(Boolean) as [IAsset, Coin][];

      return records.map(([tokenRecord, x]) => ({
        denom: tokenRecord?.displaySymbol ?? tokenRecord?.symbol ?? x.denom,
        amount: new BigNumber(x.amount).shiftedBy(
          -(tokenRecord?.decimals ?? 0),
        ),
      }));
    },
    {
      enabled: balances !== undefined && assets !== undefined,
    },
  );
};
