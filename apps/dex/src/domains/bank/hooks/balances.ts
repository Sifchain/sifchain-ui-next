import { Decimal } from "@cosmjs/math";
import { useAccounts, useConnectionUpdatedAt, useSigner, useStargateClient } from "@sifchain/cosmos-connect";
import type { StringIndexed } from "@sifchain/ui";
import { caseInsensitiveRecord, memoizeWith } from "@sifchain/utils";
import { useQuery } from "@tanstack/react-query";
import { identity, indexBy, prop } from "rambda";
import { useMemo } from "react";
import invariant from "tiny-invariant";

import { useLiquidityProvidersQuery } from "~/domains/clp/hooks";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import { useQueryWithNonQueryKeyDeps } from "~/hooks/useQueryWithNonSerializableDeps";
import { useSifStargateClient } from "~/hooks/useSifStargateClient";

type Balance = {
  amount?: Decimal;
  denom: string;
};

export const useBalanceQuery = (chainId: string, denom: string, options: { enabled: boolean } = { enabled: true }) => {
  const { client } = useStargateClient(chainId, options);
  const connectionUpdatedAt = useConnectionUpdatedAt();
  const { accounts } = useAccounts(chainId, options);
  const { indexedByDenom } = useTokenRegistryQuery();
  const token = indexedByDenom[denom];

  return useQueryWithNonQueryKeyDeps(
    ["cosm-balance", chainId, denom],
    async () => {
      const result = await client?.getBalance(accounts?.[0]?.address ?? "", denom);

      return result === undefined
        ? undefined
        : {
            ...result,
            amount: Decimal.fromAtomics(result.amount, token?.decimals ?? 0),
          };
    },
    {
      enabled: options.enabled && client !== undefined && (accounts?.length ?? 0) > 0 && token !== undefined,
    },
    [connectionUpdatedAt],
  );
};

export function useAllBalancesQuery() {
  const { data: env } = useDexEnvironment();
  const connectionUpdatedAt = useConnectionUpdatedAt();
  const { signer } = useSigner(env?.sifChainId ?? "", {
    enabled: env?.sifChainId !== undefined,
  });
  const { data: stargateClient } = useSifStargateClient();
  const { data: registry, indexedByDenom, isSuccess: isTokenRegistryQuerySuccess } = useTokenRegistryQuery();

  const baseQuery = useQueryWithNonQueryKeyDeps(
    ["all-balances", signer],
    async (): Promise<Balance[]> => {
      const accounts = await signer?.getAccounts();
      const balances = await stargateClient?.getAllBalances(accounts?.[0]?.address ?? "");

      return (
        balances?.map((x) => {
          const token = indexedByDenom[x.denom];
          return {
            ...x,
            amount: token === undefined ? undefined : Decimal.fromAtomics(x.amount, token.decimals),
          };
        }) ?? []
      );
    },
    {
      staleTime: 60000, // 1 minute
      enabled: signer !== undefined && stargateClient !== undefined && isTokenRegistryQuerySuccess,
    },
    [connectionUpdatedAt],
  );

  const indices = useMemo(() => {
    const indexedByDenom = caseInsensitiveRecord(indexBy(prop("denom"), baseQuery.data ?? []));

    const indexedBySymbol =
      baseQuery.data === undefined || registry === undefined
        ? {}
        : registry
            .filter((x) => x.denom in indexedByDenom)
            .reduce(
              (acc, x) => ({
                ...acc,
                [x.symbol.toLowerCase()]: indexedByDenom[x.denom] as Balance,
              }),
              {} as StringIndexed<Balance>,
            );

    const indexedByDisplaySymbol =
      baseQuery.data === undefined || registry === undefined
        ? {}
        : registry
            .filter((x) => x.denom in indexedByDenom && x.displaySymbol)
            .reduce(
              (acc, x) => ({
                ...acc,
                [x.displaySymbol.toLowerCase()]: indexedByDenom[x.denom] as Balance,
              }),
              {} as StringIndexed<Balance>,
            );

    return {
      indexedByDenom,
      indexedBySymbol,
      indexedByDisplaySymbol,
    };
  }, [baseQuery.data, registry]);

  return {
    ...baseQuery,
    ...indices,
    findBySymbolOrDenom: memoizeWith(identity, (symbolOrDenom: string) => {
      const sanitized = symbolOrDenom.toLowerCase();
      if (sanitized === "xrowan") {
        const balance = indices.indexedByDenom["rowan"];
        return balance;
      }
      return (
        indices.indexedBySymbol[sanitized] ??
        indices.indexedByDenom[sanitized] ??
        indices.indexedByDisplaySymbol[sanitized]
      );
    }),
  };
}

export function useBalancesWithPool() {
  const { findBySymbolOrDenom: findTokenBySymbolOrDenom } = useTokenRegistryQuery();
  const { data: liquidityProviders } = useLiquidityProvidersQuery();
  const { data: balances, findBySymbolOrDenom: findBalanceBySymbolOrDenom } = useAllBalancesQuery();
  const { data: env } = useDexEnvironment();

  const totalRowan =
    env === undefined || liquidityProviders === undefined
      ? undefined
      : liquidityProviders?.liquidityProviderData.reduce(
          (prev, curr) => prev.plus(curr.nativeAssetBalance),
          Decimal.zero(env.nativeAsset.decimals),
        );

  const denomSet = useMemo(
    () =>
      new Set([
        ...(balances?.map((x) => x.denom) ?? []),
        ...(liquidityProviders?.liquidityProviderData
          .map((x) => x.liquidityProvider?.asset?.symbol as string)
          .filter((x) => x !== undefined) ?? []),
      ]),
    [balances, liquidityProviders?.liquidityProviderData],
  );

  return useMemo(
    () =>
      Array.from(denomSet).map((x) => {
        const token = findTokenBySymbolOrDenom(x);
        const balance = findBalanceBySymbolOrDenom(x);

        const pool = liquidityProviders?.liquidityProviderData.find((y) => y.liquidityProvider?.asset?.symbol === x);

        return {
          denom: x,
          symbol: token?.symbol,
          displaySymbol: token?.displaySymbol,
          network: token?.network,
          amount: balance?.amount,
          pooledAmount: x === env?.nativeAsset.symbol.toLowerCase() ? totalRowan : pool?.externalAssetBalance,
        };
      }),
    [
      denomSet,
      env?.nativeAsset.symbol,
      findBalanceBySymbolOrDenom,
      findTokenBySymbolOrDenom,
      liquidityProviders?.liquidityProviderData,
      totalRowan,
    ],
  );
}

export function useBalancesStats() {
  const { data: stargateClient } = useSifStargateClient();
  const balances = useBalancesWithPool();

  const { indexedByDenom } = useTokenRegistryQuery();
  const usdcToken = indexedByDenom["cusdc"];

  return useQuery(
    ["balances-stats", balances],
    async () => {
      invariant(stargateClient !== undefined, "stargateClient is undefined");
      invariant(balances !== undefined, "balances is undefined");
      invariant(usdcToken !== undefined, "usdcToken is undefined");

      const zeroUsdc = Decimal.zero(usdcToken.decimals);

      const promises = balances.map(async (x) => ({
        available:
          x.denom === "cusdc"
            ? { rawReceiving: x.amount ?? zeroUsdc }
            : await stargateClient
                .simulateSwap({ denom: x.denom, amount: x.amount?.atomics ?? "0" }, { denom: "cusdc" })
                .catch(() => ({ rawReceiving: zeroUsdc })),
        pooled:
          x.denom === "cusdc"
            ? { rawReceiving: x.amount ?? zeroUsdc }
            : await stargateClient
                .simulateSwap({ denom: x.denom, amount: x.pooledAmount?.atomics ?? "0" }, { denom: "cusdc" })
                .catch(() => ({ rawReceiving: zeroUsdc })),
      }));

      const results = await Promise.all(promises);

      return results.reduce(
        (prev, curr) => ({
          totalInUsdc: prev.totalInUsdc.plus(curr.available.rawReceiving).plus(curr.pooled.rawReceiving),
          availableInUsdc: prev.availableInUsdc.plus(curr.available.rawReceiving),
          pooledInUsdc: prev.pooledInUsdc.plus(curr.pooled.rawReceiving),
        }),
        {
          totalInUsdc: zeroUsdc,
          availableInUsdc: zeroUsdc,
          pooledInUsdc: zeroUsdc,
        },
      );
    },
    {
      enabled: stargateClient !== undefined && balances !== undefined && usdcToken !== undefined,
    },
  );
}
