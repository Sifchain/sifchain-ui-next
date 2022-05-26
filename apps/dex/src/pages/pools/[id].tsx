import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEnhancedPoolQuery } from "~/domains/clp";

import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const PoolDetails: NextPage = () => {
  const { query } = useRouter();

  const externalAssetSymbol = String(query["id"]);

  const {
    data: enhancedPool,
    isLoading,
    isSuccess,
  } = useEnhancedPoolQuery(externalAssetSymbol);

  const poolSymbol = `${externalAssetSymbol.toUpperCase}·ROWAN`;

  return (
    <MainLayout title={`Pools - ${externalAssetSymbol}`}>
      <PageLayout
        withBackNavigation
        heading={
          <>
            Pools / <span className="text-sifgray-50">{poolSymbol}</span>
          </>
        }
      >
        Pool Details - {externalAssetSymbol}
        {isLoading && <p>Loading pool...</p>}
        {isSuccess && (
          <ul className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3"></ul>
        )}
      </PageLayout>
    </MainLayout>
  );
};

export default PoolDetails;
