import { NextPage } from "next";

import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const Pools: NextPage = () => {
  return (
    <MainLayout title="Pools">
      <PageLayout breadcrumbs={["/ Pools "]}>Pools Page</PageLayout>
    </MainLayout>
  );
};

export default Pools;
