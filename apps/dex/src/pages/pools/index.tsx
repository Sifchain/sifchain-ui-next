import { Pool } from "@sifchain/proto-types/sifnode/clp/v1/types";
import type { PoolStats } from "@sifchain/vanir";
import { NextPage } from "next";
import Link from "next/link";
import { FC, useMemo } from "react";

import usePoolsQuery from "~/domains/clp/hooks/usePools";
import usePoolStatsQuery from "~/domains/clp/hooks/usePoolStats";
import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const Pools: NextPage = () => {
  const { data: poolsRes, ...poolsQuery } = usePoolsQuery();
  const { indexedBySymbol, ...statsQuery } = usePoolStatsQuery();

  const enhancedPools = useMemo(() => {
    return poolsRes?.pools.map((pool) => ({
      ...pool,
      stats: pool.externalAsset
        ? indexedBySymbol[pool.externalAsset.symbol]
        : undefined,
    }));
  }, [poolsRes, indexedBySymbol]);

  const isLoading = poolsQuery.isLoading || statsQuery.isLoading;
  const isSuccess = poolsQuery.isSuccess && statsQuery.isSuccess;

  return (
    <MainLayout title="Pools">
      <PageLayout heading="Pools">
        {isLoading && <p>Loading pools...</p>}
        {isSuccess && (
          <ul className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {enhancedPools?.map((pool) => (
              <PoolItem key={pool.externalAsset?.symbol} pool={pool} />
            ))}
          </ul>
        )}
      </PageLayout>
    </MainLayout>
  );
};

const PoolItem: FC<{ pool: Pool; stats?: PoolStats }> = ({ pool, stats }) => (
  <Link href={`/pools/${pool.externalAsset?.symbol}`}>
    <li
      className="p-4 rounded-lg bg-sifgray-900 min-h-[200px] hover:opacity-60 transition-opacity overflow-x-hidden"
      role="button"
    >
      ROWAN/{pool.externalAsset?.symbol.toUpperCase()}
      <div>{JSON.stringify(stats)}</div>
    </li>
  </Link>
);

export default Pools;
