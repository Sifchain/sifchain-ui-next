import type { NextPage } from "next";

import Head from "next/head";
import { TabsWithSuspense, TabsWithSuspenseProps } from "@sifchain/ui";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";

const DEFAULT_TAB_ITEM = "trade";
const TAB_ITEMS: TabsWithSuspenseProps["items"] = [
  {
    title: "Trade",
    slug: "trade",
    content: dynamic(() => import("~/compounds/Margin/Trade"), {
      suspense: true,
    }),
  },
  {
    title: "Portfolio",
    slug: "portfolio",
    content: dynamic(() => import("~/compounds/Margin/Portfolio"), {
      suspense: true,
    }),
  },
];

const Margin: NextPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  /**
   * If a page does not have data fetching methods, router.query will be an empty object
   * on the page's first load, when the page gets pre-generated on the server.
   * https://nextjs.org/docs/api-reference/next/router#router-object
   *
   * Because of that, the nested tab flickers. For example:
   *    /margin?tab=portfolio&option=history
   *
   * The above URL will NOT render the correct "History" option at first load
   * It will render "Open positions" (hardcoded default) and then flicks to "History"
   * This is not an ideal UX; hence, we need the sync below with router.isReady
   */
  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (router.query["tab"]) {
      setActiveTab(router.query["tab"] as string);
    } else {
      setActiveTab(DEFAULT_TAB_ITEM);
    }
  }, [router.isReady, router.query]);

  return (
    <>
      <Head>
        <title>Sichain Dex - Margin</title>
      </Head>

      <section className="w-full bg-black py-12 px-24">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-white">Margin</h2>
        </header>
        {router.isReady && activeTab !== null ? (
          <TabsWithSuspense
            activeTab={activeTab}
            items={TAB_ITEMS}
            renderItem={(title, slug) => (
              <Link href={{ query: { tab: slug } }}>
                <a className="flex py-2">{title}</a>
              </Link>
            )}
          />
        ) : (
          <div className="bg-gray-850 p-10 text-center text-gray-100">
            Loading...
          </div>
        )}
      </section>
    </>
  );
};

export default Margin;
