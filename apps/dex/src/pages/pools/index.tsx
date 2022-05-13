import { NextPage } from "next";
import usePoolsQuery from "~/domains/clp/hooks/usePools";

import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const Pools: NextPage = () => {
  const { data: poolsRes, isLoading, isSuccess } = usePoolsQuery();

  return (
    <MainLayout title="Pools">
      <PageLayout breadcrumbs={["/ Pools "]}>
        {isLoading && <p>Loading pools...</p>}
        {isSuccess && (
          <ul className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {poolsRes?.pools.map((pool) => (
              <li
                key={pool.externalAsset?.symbol}
                className="p-4 rounded-lg bg-sifgray-900"
              >
                ROWAN/{pool.externalAsset?.symbol.toUpperCase()}
              </li>
            ))}
          </ul>
        )}
      </PageLayout>
    </MainLayout>
  );
};

export default Pools;
