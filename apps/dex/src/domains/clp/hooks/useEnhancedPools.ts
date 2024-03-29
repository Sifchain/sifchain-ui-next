import type { IAsset } from "@sifchain/common";
import type { GetTokenStatsResponsePools } from "@sifchain/sif-api";
import { ascend, caseInsensitiveRecord, descend, sortWith } from "@sifchain/utils";
import { useQuery } from "@tanstack/react-query";
import { indexBy } from "rambda";
import { useMemo } from "react";

import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import { usePoolsQuery } from "./usePools";
import { usePoolStatsQuery } from "./usePoolStats";

export function useEnhancedPoolsQuery() {
  const { data: poolsRes, ...poolsQuery } = usePoolsQuery();
  const statsQuery = usePoolStatsQuery();
  const registryQuery = useTokenRegistryQuery();

  const isSuccess = poolsQuery.isSuccess && statsQuery.isSuccess && registryQuery.isSuccess;

  const isLoading = poolsQuery.isLoading || statsQuery.isLoading || registryQuery.isLoading;

  const derivedQuery = useQuery(
    ["enhanced-pools"],
    () => {
      if (!poolsRes || !statsQuery.data || !registryQuery.data) {
        return [];
      }

      const filtered = poolsRes.pools
        .map((pool) => {
          const externalAssetSymbol = pool.externalAsset?.symbol ?? "";
          const asset = registryQuery.findBySymbolOrDenom(externalAssetSymbol);

          const stats = asset
            ? statsQuery.indexedBySymbol[asset?.symbol.toLowerCase()] ??
              statsQuery.indexedBySymbol[asset?.displaySymbol.toLowerCase()]
            : undefined;

          return {
            ...pool,
            stats: stats as GetTokenStatsResponsePools & {
              health: number;
              interestRate: number;
              tvl_24h_change: number;
              volume_24h_change: number;
              rowan_24h_change: number;
              asset_24h_change: number;
              margin_apr: number;
            },
            asset: asset as IAsset,
          };
        })
        .filter((pool) => Boolean(pool.asset) && Boolean(pool.stats));

      return sortWith([descend((x) => x.stats.poolTVL ?? 0), ascend((x) => x.asset.displaySymbol ?? 0)], filtered);
    },
    {
      enabled: isSuccess,
    },
  );

  const indices = useMemo(() => {
    if (!derivedQuery.data) {
      return {
        indexedBySymbol: {},
        indexedByDisplaySymbol: {},
        findBySymbolOrDenom: () => undefined,
      };
    }

    const indexedBySymbol = caseInsensitiveRecord(indexBy((x) => x.asset.symbol, derivedQuery.data));

    const indexedByDisplaySymbol = caseInsensitiveRecord(
      indexBy(({ asset }) => asset.displaySymbol, derivedQuery.data),
    );

    return {
      indexedBySymbol,
      indexedByDisplaySymbol,
      findBySymbolOrDenom(symbolOrDenom: string) {
        const sanitized = symbolOrDenom.toLowerCase();
        return indexedBySymbol[sanitized] ?? indexedByDisplaySymbol[sanitized];
      },
    };
  }, [derivedQuery.data]);

  return {
    ...derivedQuery,
    ...indices,
    isSuccess,
    isLoading,
  };
}
/**
 * Queries a single pool by symbol.
 *
 * @param externalAssetSymbol {string}
 * @returns
 */
export function useEnhancedPoolQuery(externalAssetSymbol: string) {
  const { findBySymbolOrDenom, ...query } = useEnhancedPoolsQuery();

  const sanitizedSymbol = externalAssetSymbol.toLowerCase();

  return {
    ...query,
    data: query.isSuccess ? findBySymbolOrDenom(sanitizedSymbol) : undefined,
  };
}
