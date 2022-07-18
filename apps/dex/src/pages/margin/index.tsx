import type { NextPage } from "next";
import type { ParsedUrlQuery } from "querystring";

import { TabsWithSuspense, TabsWithSuspenseProps } from "@sifchain/ui";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";

import PageLayout from "~/layouts/PageLayout";

const DEFAULT_TAB_ITEM = "trade";
const TAB_ITEMS: TabsWithSuspenseProps["items"] = [
  {
    title: "Trade",
    slug: "trade",
    content: dynamic(() => import("~/compounds/Margin/Trade")),
  },
  {
    title: "Portifolio",
    slug: "portifolio",
    content: dynamic(() => import("~/compounds/Margin/Portifolio")),
  },
];

const Margin: NextPage = () => {
  const router = useRouter();
  const [querystring, setQuerystring] = useState<ParsedUrlQuery | null>(null);

  /**
   * If a page does not have data fetching methods, router.query will be an empty object
   * on the page's first load, when the page gets pre-generated on the server.
   * https://nextjs.org/docs/api-reference/next/router#router-object
   *
   * Because of that, the nested tab flickers. For example:
   *    /margin?tab=portifolio&option=history
   *
   * The above URL will NOT render the correct "History" option at first load
   * It will render "Open positions" (hardcoded default) and then flicks to "History"
   * This is not an ideal UX; hence, we need the sync below with router.isReady
   */
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setQuerystring(router.query);
  }, [router.isReady, router.query]);

  let content = <div className="bg-gray-850 p-10 text-center">Loading...</div>;

  if (querystring !== null) {
    const activeTab = (querystring["tab"] as string) || DEFAULT_TAB_ITEM;
    content = (
      <TabsWithSuspense
        activeTab={activeTab}
        items={TAB_ITEMS}
        loadingFallback={
          <div className="bg-gray-850 p-10 text-center">Loading...</div>
        }
        renderItem={(title, slug) => (
          <Link href={{ query: { tab: slug } }}>
            <a className="flex py-2">{title}</a>
          </Link>
        )}
      />
    );
  }

  return (
    <section className="w-full bg-black py-12 px-24">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white">Margin</h2>
      </header>
      {content}
    </section>
  );
};

export default Margin;
