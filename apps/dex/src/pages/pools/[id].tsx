import { NextPage } from "next";

import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const PoolDetails: NextPage = () => {
  return (
    <MainLayout title="Pools - XYZ">
      <PageLayout>Pool Details - XYZ</PageLayout>
    </MainLayout>
  );
};

export default PoolDetails;
