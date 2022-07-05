import { Decimal } from "@cosmjs/math";
import { useSigner } from "@sifchain/cosmos-connect";
import { indexBy, prop } from "rambda";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useLiquidityProviders } from "~/domains/clp";
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

export const useBalancesWithPool = () => {
  const { indexedByIBCDenom } = useTokenRegistryQuery();
  const { data: liquidityProviders } = useLiquidityProviders();
  const { data: balances } = useAllBalances();

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

  return {
    balances: useMemo(
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
            pool,
          };
        }),
      [balances, denomSet, indexedByIBCDenom, liquidityProviders?.pools],
    ),
    totalRowan,
  };
};
