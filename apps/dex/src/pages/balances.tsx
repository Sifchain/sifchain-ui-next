import { NextPage } from "next";
import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const AssetsPage: NextPage = () => {
  return (
    <MainLayout title="Swap">
      <PageLayout breadcrumbs={["/assets"]}>Assets Page</PageLayout>
    </MainLayout>
  );
};

export default AssetsPage;
