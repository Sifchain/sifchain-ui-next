import { Decimal } from "@cosmjs/math";
import { useSigner } from "@sifchain/cosmos-connect";
import { indexBy, prop } from "rambda";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useLiquidityProviders } from "~/domains/clp";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import {
  useSifSigningStargateClient,
  useSifStargateClient,
} from "~/hooks/useSifStargateClient";

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

export const useBalancesWithPool = () => {
  const { indexedByIBCDenom } = useTokenRegistryQuery();
  const { data: liquidityProviders } = useLiquidityProviders();
  const { data: balances } = useAllBalances();
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
};

export const useBalancesStats = () => {
  const { data: stargateClient } = useSifStargateClient();
  const balances = useBalancesWithPool();

  return useQuery(
    ["balances-stats", balances],
    () => {
      const promises = balances!.map(async (x) => ({
        available:
          x.denom === "cusdc"
            ? { rawReceiving: x.amount ?? Decimal.zero(6) }
            : await stargateClient!.simulateSwap(
                { denom: x.denom, amount: x.amount?.atomics ?? "0" },
                { denom: "cusdc" },
              ),
        pooled:
          x.denom === "cusdc"
            ? { rawReceiving: x.amount ?? Decimal.zero(6) }
            : await stargateClient!.simulateSwap(
                { denom: x.denom, amount: x.pooledAmount?.atomics ?? "0" },
                { denom: "cusdc" },
              ),
      }));

      return Promise.all(promises).then((x) =>
        x.reduce(
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
        ),
      );
    },
    { enabled: stargateClient !== undefined && balances !== undefined },
  );
};
