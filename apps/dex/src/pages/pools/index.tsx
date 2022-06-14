import type { IAsset } from "@sifchain/common";
import type { Pool } from "@sifchain/proto-types/sifnode/clp/v1/types";
import { formatNumberAsCurrency } from "@sifchain/ui";
import type { GetTokenStatsResponsePools } from "@sifchain/vanir-client";
import type { NextPage } from "next";
import Link from "next/link";
import type { FC } from "react";

import AssetIcon from "~/compounds/AssetIcon";
import { useEnhancedPoolsQuery } from "~/domains/clp/hooks";
import PageLayout from "~/layouts/PageLayout";

const Pools: NextPage = () => {
  const { data: enhancedPools, isLoading, isSuccess } = useEnhancedPoolsQuery();

  return (
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
  );
};

const PoolItem: FC<{
  pool: Pool;
  asset: IAsset;
  stats?: GetTokenStatsResponsePools;
}> = ({ asset, stats }) => {
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
    <Link href={`/pools/${asset?.displaySymbol}`}>
      <li
        className="rounded-lg bg-gray-800 min-h-[200px] hover:opacity-80 transition-opacity overflow-x-hidden grid gap-2"
        role="button"
      >
        <div className="flex gap-1 items-center p-4 font-semibold">
          <AssetIcon network="sifchain" symbol="rowan" size="md" />
          ROWAN -
          <AssetIcon network="sifchain" symbol={asset.symbol} size="md" />
          {asset.displaySymbol.toUpperCase()}
        </div>
        <ul className="grid gap-2 p-4 bg-gray-850 text-sm">
          {statSummary.map((stat) => (
            <li key={stat.label} className="flex justify-between">
              <span className="text-gray-300 font-normal">{stat.label}</span>
              <span className="text-gray-50 font-semibold">{stat.value}</span>
            </li>
          ))}
        </ul>
      </li>
    </Link>
  );
};

export default Pools;
