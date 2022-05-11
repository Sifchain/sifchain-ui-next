import type { NextPage } from "next";

import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <PageLayout breadcrumbs={["/home", "/bin"]}></PageLayout>
    </MainLayout>
  );
};

export default Home;
