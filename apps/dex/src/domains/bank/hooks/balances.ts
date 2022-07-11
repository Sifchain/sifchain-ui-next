import { Decimal } from "@cosmjs/math";
import { useSigner } from "@sifchain/cosmos-connect";
import { type StringIndexed, invariant } from "@sifchain/ui";
import { compose, identity, indexBy, prop, toLower } from "rambda";
import { memoizeWith } from "ramda";
import { useMemo } from "react";
import { useQuery } from "react-query";

import { useLiquidityProviders } from "~/domains/clp";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import {
  useSifSigningStargateClient,
  useSifStargateClient,
} from "~/hooks/useSifStargateClient";

type Balance = {
  amount: Decimal;
  denom: string;
};

export function useAllBalancesQuery() {
  const { data: env } = useDexEnvironment();
  const { signer } = useSigner(env?.sifChainId ?? "", {
    enabled: env?.sifChainId !== undefined,
  });
  const { data: signingStargateClient } = useSifSigningStargateClient();
  const {
    data: registry,
    indexedByIBCDenom,
    isSuccess: isTokenRegistryQuerySuccess,
  } = useTokenRegistryQuery();

  const baseQuery = useQuery(
    "all-balances",
    async (): Promise<Balance[]> => {
      const accounts = await signer?.getAccounts();
      const balances = await signingStargateClient?.getAllBalances(
        accounts?.[0]?.address ?? "",
      );

      return (
        balances?.map((x) => ({
          ...x,
          amount: Decimal.fromAtomics(
            x.amount,
            indexedByIBCDenom[x.denom.toLowerCase()]?.decimals ?? 0,
          ),
        })) ?? []
      );
    },
    {
      staleTime: 60000, // 1 minute
      enabled:
        signer !== undefined &&
        signingStargateClient !== undefined &&
        isTokenRegistryQuerySuccess,
    },
  );

  const indices = useMemo(() => {
    const indexedByDenom = indexBy(
      compose(toLower, prop("denom")),
      baseQuery.data ?? [],
    );

    const indexedBySymbol =
      baseQuery.data === undefined || registry === undefined
        ? {}
        : registry
            .filter((x) => x.ibcDenom in indexedByDenom)
            .reduce(
              (acc, x) => ({
                ...acc,
                [x.symbol.toLowerCase()]: indexedByDenom[x.ibcDenom] as Balance,
              }),
              {} as StringIndexed<Balance>,
            );

    const indexedByDisplaySymbol =
      baseQuery.data === undefined || registry === undefined
        ? {}
        : registry
            .filter((x) => x.ibcDenom in indexedByDenom && x.displaySymbol)
            .reduce(
              (acc, x) => ({
                ...acc,
                [x.displaySymbol.toLowerCase()]: indexedByDenom[
                  x.ibcDenom
                ] as Balance,
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
  const { indexedByIBCDenom } = useTokenRegistryQuery();
  const { data: liquidityProviders } = useLiquidityProviders();
  const { data: balances } = useAllBalancesQuery();
  const { data: env } = useDexEnvironment();

  const totalRowan = liquidityProviders?.pools.reduce(
    (prev, curr) => prev.plus(curr.nativeAssetBalance),
    Decimal.zero(18),
  );

  const denomSet = useMemo(
    () =>
      new Set([
        ...(balances?.map((x) => x.denom) ?? []),
        ...(liquidityProviders?.pools
          .map((x) => x.liquidityProvider?.asset?.symbol as string)
          .filter((x) => x !== undefined) ?? []),
      ]),
    [balances, liquidityProviders?.pools],
  );

  return useMemo(
    () =>
      Array.from(denomSet).map((x) => {
        const token = indexedByIBCDenom[x];
        const balance = balances?.find((y) => y.denom === x);
        const pool = liquidityProviders?.pools.find(
          (y) => y.liquidityProvider?.asset?.symbol === x,
        );

        return {
          denom: x,
          symbol: token?.symbol,
          displaySymbol: token?.displaySymbol,
          network: token?.network,
          amount: balance?.amount,
          pooledAmount:
            x === env?.nativeAsset.symbol.toLowerCase()
              ? totalRowan
              : pool?.externalAssetBalance,
        };
      }),
    [
      balances,
      denomSet,
      env?.nativeAsset.symbol,
      indexedByIBCDenom,
      liquidityProviders?.pools,
      totalRowan,
    ],
  );
}

export function useBalancesStats() {
  const { data: stargateClient } = useSifStargateClient();
  const balances = useBalancesWithPool();

  return useQuery(
    ["balances-stats", balances],
    async () => {
      invariant(stargateClient !== undefined, "stargateClient is undefined");
      invariant(balances !== undefined, "balances is undefined");

      const promises = balances.map(async (x) => ({
        available:
          x.denom === "cusdc"
            ? { rawReceiving: x.amount ?? Decimal.zero(6) }
            : await stargateClient.simulateSwap(
                { denom: x.denom, amount: x.amount?.atomics ?? "0" },
                { denom: "cusdc" },
              ),
        pooled:
          x.denom === "cusdc"
            ? { rawReceiving: x.amount ?? Decimal.zero(6) }
            : await stargateClient.simulateSwap(
                { denom: x.denom, amount: x.pooledAmount?.atomics ?? "0" },
                { denom: "cusdc" },
              ),
      }));

      const results = await Promise.all(promises);

      return results.reduce(
        (prev, curr) => ({
          totalInUsdc: prev.totalInUsdc
            .plus(curr.available.rawReceiving)
            .plus(curr.pooled.rawReceiving),
          availableInUsdc: prev.availableInUsdc.plus(
            curr.available.rawReceiving,
          ),
          pooledInUsdc: prev.pooledInUsdc.plus(curr.pooled.rawReceiving),
        }),
        {
          totalInUsdc: Decimal.zero(6),
          availableInUsdc: Decimal.zero(6),
          pooledInUsdc: Decimal.zero(6),
        },
      );
    },
    { enabled: stargateClient !== undefined && balances !== undefined },
  );
}
