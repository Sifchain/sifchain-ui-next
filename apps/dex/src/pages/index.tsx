import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/swap");
  }, [router]);

  return (
    <MainLayout>
      <PageLayout breadcrumbs={["/ home"]}></PageLayout>
    </MainLayout>
  );
};

export default Home;
