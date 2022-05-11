import { NextPage } from "next";

import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const PoolDetails: NextPage = () => {
  return (
    <MainLayout>
      <PageLayout>Pool Details</PageLayout>
    </MainLayout>
  );
};

export default PoolDetails;
