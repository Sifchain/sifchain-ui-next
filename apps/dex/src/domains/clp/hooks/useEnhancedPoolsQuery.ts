import { IAsset } from "@sifchain/core";
import { GetTokenStatsResponsePools } from "@sifchain/vanir-client";
import { ascend, descend, sortWith } from "ramda";
import { useQuery } from "react-query";

import useTokenRegistryQuery from "~/domains/tokenRegistry/hooks/useTokenRegistry";
import usePoolsQuery from "./usePools";
import usePoolStatsQuery from "./usePoolStats";

export default function useEnhancedPoolsQuery() {
  const { data: poolsRes, ...poolsQuery } = usePoolsQuery();
  const statsQuery = usePoolStatsQuery();
  const registryQuery = useTokenRegistryQuery();

  const derivedQuery = useQuery(
    "enhanced-pools",
    () => {
      if (!poolsRes || !statsQuery.data || !registryQuery.data) {
        return;
      }

      const filtered = poolsRes.pools
        .map((pool) => {
          const externalAssetSymbol = pool.externalAsset?.symbol.toLowerCase();
          const asset = externalAssetSymbol
            ? registryQuery.indexedBySymbol[externalAssetSymbol] ??
              registryQuery.indexedIBCDenom[externalAssetSymbol]
            : undefined;

          const stats = asset
            ? statsQuery.indexedBySymbol[asset?.symbol.toLowerCase()] ??
              statsQuery.indexedBySymbol[asset?.displaySymbol.toLowerCase()]
            : undefined;

          return {
            ...pool,
            stats: stats as GetTokenStatsResponsePools,
            asset: asset as IAsset,
          };
        })
        .filter((pool) => Boolean(pool.asset) && Boolean(pool.stats));

      return sortWith(
        [
          descend((x) => x.stats.poolTVL ?? 0),
          ascend((x) => x.asset.displaySymbol ?? 0),
        ],
        filtered,
      );
    },
    {
      enabled:
        poolsQuery.isSuccess && statsQuery.isSuccess && registryQuery.isSuccess,
    },
  );

  return {
    ...derivedQuery,
    isLoading:
      poolsQuery.isLoading ||
      statsQuery.isLoading ||
      registryQuery.isLoading ||
      registryQuery.isLoading,
    isSuccess:
      poolsQuery.isSuccess && statsQuery.isSuccess && registryQuery.isSuccess,
  };
}
