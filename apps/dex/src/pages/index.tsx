import type { NextPage } from "next";

import { ThemeSwitcher } from "@sifchain/ui";

import MainLayout from "../layouts/MainLayout";
import PageLayout from "../layouts/PageLayout";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <ThemeSwitcher />
      <PageLayout breadcrumbs={["/home", "/bin"]}></PageLayout>
    </MainLayout>
  );
};

export default Home;
