import React from "react";
import MainLayout from "../layouts/MainLayout";
import PageLayout from "../layouts/PageLayout";

const AssetsPage = () => {
  return (
    <MainLayout title="Swap">
      <PageLayout breadcrumbs={["/assets"]}>Assets Page</PageLayout>
    </MainLayout>
  );
};

export default AssetsPage;
