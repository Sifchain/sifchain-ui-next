import { IAsset } from "@sifchain/core";
import { Pool } from "@sifchain/proto-types/sifnode/clp/v1/types";
import { formatNumberAsCurrency } from "@sifchain/ui";
import { GetTokenStatsResponsePools } from "@sifchain/vanir-client";
import { NextPage } from "next";
import Link from "next/link";
import { ascend, descend, sortWith } from "ramda";
import { FC } from "react";
import { useQuery } from "react-query";

import usePoolsQuery from "~/domains/clp/hooks/usePools";
import usePoolStatsQuery from "~/domains/clp/hooks/usePoolStats";
import useTokenRegistryQuery from "~/domains/tokenRegistry/hooks/useTokenRegistry";
import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const Pools: NextPage = () => {
  const { data: enhancedPools, isLoading, isSuccess } = useEnhancedPoolsQuery();

  return (
    <MainLayout title="Pools">
      <PageLayout heading="Pools">
        {isLoading && <p>Loading pools...</p>}
        {isSuccess && (
          <ul className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {enhancedPools?.map((pool) => (
              <PoolItem
                key={pool.externalAsset?.symbol}
                pool={pool}
                stats={pool.stats}
                asset={pool.asset}
              />
            ))}
          </ul>
        )}
      </PageLayout>
    </MainLayout>
  );
};

function useEnhancedPoolsQuery() {
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

const PoolItem: FC<{
  pool: Pool;
  asset: IAsset;
  stats?: GetTokenStatsResponsePools;
}> = ({ pool, asset, stats }) => {
  const statSummary = [
    {
      label: "Total liquidity",
      value: formatNumberAsCurrency(stats?.poolTVL ?? 0),
    },
    {
      label: "Trading volume",
      value: formatNumberAsCurrency(stats?.volume ?? 0),
    },
    {
      label: "Pool APR",
      value: `${(stats?.poolApr ?? 0).toFixed(2)}%`,
    },
    {
      label: "Arb opportunity",
      value: (
        <span
          className={Number(stats?.arb) > 0 ? "text-green-500" : "text-red-500"}
        >
          {(stats?.arb ?? 0).toFixed(2)}%
        </span>
      ),
    },
  ];
  return (
    <Link href={`/pools/${asset?.symbol}`}>
      <li
        className="p-4 rounded-lg bg-sifgray-900 min-h-[200px] hover:opacity-60 transition-opacity overflow-x-hidden grid gap-2"
        role="button"
      >
        <div className="flex gap-2 items-center">
          <div className="h-6 w-6 text-2xl rounded-full bg-white grid place-items-center overflow-hidden ring ring-black">
            <img className="h-[1em] w-[1em]" src={asset.imageUrl} />
          </div>
          {asset.displaySymbol.toUpperCase()}
        </div>
        <ul className="grid gap-1">
          {statSummary.map((stat) => (
            <div key={stat.label} className="flex justify-between">
              <span className="text-gray-500">{stat.label}</span>
              <span className="text-gray-50">{stat.value}</span>
            </div>
          ))}
        </ul>
      </li>
    </Link>
  );
};

export default Pools;
