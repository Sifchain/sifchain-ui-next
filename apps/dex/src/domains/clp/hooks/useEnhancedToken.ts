import { useMemo } from "react";
import { useQuery } from "react-query";

import { useAllBalancesQuery } from "~/domains/bank/hooks/balances";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import { usePoolStatsQuery } from ".";

/**
 * Aggregates pool, tokenStats, and tokenBalances for a token.
 *
 * @param denom
 * @param options
 * @returns
 */
export function useEnhancedTokenQuery(denom: string, options?: { refetchInterval: number; enabled: boolean }) {
  const registryQuery = useTokenRegistryQuery();
  const allBalancesQuery = useAllBalancesQuery();
  const poolStatsQuery = usePoolStatsQuery();

  const registryEntry = registryQuery.indexedByDenom[denom];
  const balanceEntry = useMemo(
    () => allBalancesQuery.data?.find((entry) => entry.denom === denom || entry.denom === registryEntry?.denom),
    [allBalancesQuery.data, registryEntry?.denom, denom],
  );

  const poolQuery = useSifnodeQuery(
    "clp.getPool",
    [
      {
        symbol: denom,
      },
    ],
    options,
  );

  const derivedQuery = useQuery(
    ["enhanced-token", denom],
    () => {
      if (!registryEntry) {
        console.log(`Token registry entry not found for ${denom}`);
        return;
      }

      const stat = poolStatsQuery.data?.pools?.find(
        (entry) => entry.symbol === denom || entry.symbol === denom.slice(1),
      );

      return {
        ...registryEntry,
        balance: balanceEntry?.amount,
        pool: poolQuery.data?.pool,
        priceUsd: denom.toLowerCase() === "rowan" ? Number(poolStatsQuery.data?.rowanUSD) : stat?.priceToken ?? 0,
      };
    },
    {
      enabled: Boolean(denom) && registryQuery.isSuccess && (denom === "rowan" || poolQuery.isSuccess),
    },
  );

  return {
    ...derivedQuery,
    isLoading:
      derivedQuery.isLoading ||
      registryQuery.isLoading ||
      allBalancesQuery.isLoading ||
      poolQuery.isLoading ||
      poolStatsQuery.isLoading,
    error:
      derivedQuery.error ?? registryQuery.error ?? allBalancesQuery.error ?? poolQuery.error ?? poolStatsQuery.error,
  };
}
