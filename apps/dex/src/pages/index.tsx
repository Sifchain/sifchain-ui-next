import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import PageLayout from "~/layouts/PageLayout";
import { useFeatureFlag } from "~/lib/featureFlags";

const Home: NextPage = () => {
  const router = useRouter();
  const isMarginStandaloneOn = useFeatureFlag("margin-standalone");

  useEffect(() => {
    if (isMarginStandaloneOn) {
      router.push("/margin");
    } else {
      router.push("/pools");
    }
  }, [isMarginStandaloneOn, router]);

  return <PageLayout heading="Home"></PageLayout>;
};

export default Home;
