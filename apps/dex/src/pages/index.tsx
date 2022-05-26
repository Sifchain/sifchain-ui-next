import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/pools");
  }, [router]);

  return (
    <MainLayout>
      <PageLayout heading="Home"></PageLayout>
    </MainLayout>
  );
};

export default Home;
