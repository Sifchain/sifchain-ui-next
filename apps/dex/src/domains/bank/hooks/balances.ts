import { Decimal } from "@cosmjs/math";
import type { IAsset } from "@sifchain/common";
import { useSigner } from "@sifchain/cosmos-connect";
import BigNumber from "bignumber.js";
import { indexBy, prop } from "rambda";
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
  const { indexedByIBCDenom, isSuccess: isTokenRegistryQuerySuccess } =
    useTokenRegistryQuery();

  const baseQuery = useQuery(
    "all-balances",
    async () => {
      const accounts = await signer?.getAccounts();
      const balances = await signingStargateClient?.getAllBalances(
        accounts?.[0]?.address ?? "",
      );

      return balances?.map((x) => ({
        ...x,
        amount: Decimal.fromAtomics(
          x.amount,
          indexedByIBCDenom[x.denom]?.decimals ?? 0,
        ),
      }));
    },
    {
      enabled:
        signer !== undefined &&
        signingStargateClient !== undefined &&
        isTokenRegistryQuerySuccess,
    },
  );

  return {
    ...baseQuery,
    indexedByDenom:
      baseQuery.data === undefined
        ? undefined
        : indexBy(prop("denom"), baseQuery.data),
  };
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
        .filter(Boolean) as [IAsset, { amount: Decimal; denom: string }][];

      return records?.map(([tokenRecord, x]) => ({
        denom: tokenRecord?.displaySymbol ?? tokenRecord?.symbol ?? x.denom,
        amount: new BigNumber(x.amount.atomics).shiftedBy(
          -(tokenRecord?.decimals ?? 0),
        ),
      }));
    },
    {
      enabled: balances !== undefined && assets !== undefined,
    },
  );
};
