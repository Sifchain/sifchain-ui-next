import type { NextPage } from "next";

import { TabsWithSuspense, TabsWithSuspenseProps } from "@sifchain/ui";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";

import PageLayout from "~/layouts/PageLayout";

const DEFAULT_TAB_ITEM = "portifolio";
const TAB_ITEMS: TabsWithSuspenseProps["items"] = [
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
  const activeTab = (router.query["tab"] as string) || DEFAULT_TAB_ITEM;
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
