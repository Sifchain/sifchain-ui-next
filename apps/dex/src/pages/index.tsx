import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import PageLayout from "~/layouts/PageLayout";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/pools");
  }, [router]);

  return <PageLayout heading="Home"></PageLayout>;
};

export default Home;
