import type { NextPage } from "next";

import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { TabsWithSuspense } from "@sifchain/ui";

import PageLayout from "~/layouts/PageLayout";

const TAB_ITEMS = [
  {
    title: "Portifolio",
    slug: "portifolio",
    content: dynamic(() => import("~/compounds/Margin/Portifolio")),
  },
  {
    title: "Trade",
    slug: "trade",
    content: dynamic(() => import("~/compounds/Margin/Trade")),
  },
];

const Margin: NextPage = () => {
  const router = useRouter();
  const activeTab = (router.query["tab"] as string) || "portifolio";
  return (
    <PageLayout heading="Margin">
      <TabsWithSuspense
        activeTab={activeTab}
        items={TAB_ITEMS}
        loadingFallback="Loading..."
        renderItem={(title, slug) => (
          <Link href={{ query: { tab: slug } }}>
            <a className="flex py-2">{title}</a>
          </Link>
        )}
      />
    </PageLayout>
  );
};

export default Margin;
