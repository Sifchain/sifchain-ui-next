import type { NextPage } from "next";

import { ThemeSwitcher } from "@sifchain/ui";

import MainLayout from "../layouts/MainLayout";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <ThemeSwitcher />
    </MainLayout>
  );
};

export default Home;
