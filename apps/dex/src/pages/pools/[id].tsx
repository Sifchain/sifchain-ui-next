import { NextPage } from "next";
import { useRouter } from "next/router";

import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const PoolDetails: NextPage = () => {
  const { query } = useRouter();

  const queryId = String(query["id"]).toUpperCase();

  return (
    <MainLayout title={`Pools - ${queryId}`}>
      <PageLayout heading={`Pools - ${queryId}`}>
        Pool Details - {queryId}
      </PageLayout>
    </MainLayout>
  );
};

export default PoolDetails;
