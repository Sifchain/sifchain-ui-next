import type { NextPage } from "next";

import { pathOr } from "ramda";
import { TabsWithSuspense, TabsWithSuspenseProps } from "@sifchain/ui";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";

const TABS = {
  trade: { title: "Trade", slug: "trade" },
  portfolio: { title: "Portfolio", slug: "portfolio" },
} as const;
const TABS_CONTENT: TabsWithSuspenseProps["items"] = [
  {
    title: TABS.trade.title,
    slug: TABS.trade.slug,
    content: dynamic(() => import("~/compounds/Margin/Trade"), {
      suspense: true,
    }),
  },
  {
    title: TABS.portfolio.title,
    slug: TABS.portfolio.slug,
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

    /**
     * @TODO Silently fallback to "Trade" in case the querystring doesn't match any slugs
     *   - In this scenario, the URL will be stale but internal state is corrcect
     *   - As an improvement, we could use `router.push` to update the URL as well
     */
    const tabOption = pathOr(TABS.trade.slug, ["tab"], router.query);
    const matchContent = pathOr(TABS.trade, [tabOption], TABS);
    setActiveTab(matchContent.slug);
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
            items={TABS_CONTENT}
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
