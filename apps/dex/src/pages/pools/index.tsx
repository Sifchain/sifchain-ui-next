import { Pool } from "@sifchain/proto-types/sifnode/clp/v1/types";
import { NextPage } from "next";
import Link from "next/link";
import { FC, useMemo } from "react";

import usePoolsQuery from "~/domains/clp/hooks/usePools";
import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const Pools: NextPage = () => {
  const { data: poolsRes, isLoading, isSuccess } = usePoolsQuery();

  const enhancedPools = useMemo(() => {
    return poolsRes?.pools.map((pool) => ({
      ...pool,
    }));
  }, [poolsRes]);

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

const PoolItem: FC<{ pool: Pool }> = ({ pool }) => (
  <Link href={`/pools/${pool.externalAsset?.symbol}`}>
    <li className="p-4 rounded-lg bg-sifgray-900">
      ROWAN/{pool.externalAsset?.symbol.toUpperCase()}
    </li>
  </Link>
);

export default Pools;
