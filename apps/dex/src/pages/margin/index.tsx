import type { NextPage } from "next";

import { FlashMessageLoading, TabsWithSuspense, TabsWithSuspenseProps } from "@sifchain/ui";
import { useMemo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useFeatureFlag } from "~/lib/featureFlags";

const TABS = {
  trade: { title: "Trade", slug: "trade" },
  positions: { title: "Positions", slug: "positions" },
  history: { title: "History", slug: "history" },
};
const TABS_CONTENT: TabsWithSuspenseProps["items"] = [
  {
    title: TABS.trade.title,
    slug: TABS.trade.slug,
    content: dynamic(() => import("~/compounds/Margin/Trade"), {
      suspense: true,
      ssr: false,
    }),
  },
  {
    title: TABS.positions.title,
    slug: TABS.positions.slug,
    content: dynamic(() => import("~/compounds/Margin/Positions"), {
      suspense: true,
      ssr: false,
    }),
  },
  {
    title: TABS.history.title,
    slug: TABS.history.slug,
    content: dynamic(() => import("~/compounds/Margin/History"), {
      suspense: true,
      ssr: false,
    }),
  },
];

const Margin: NextPage = () => {
  const router = useRouter();
  const activeTab = useMemo(() => {
    if (router.isReady) {
      const tabOption = (router.query["tab"] as keyof typeof TABS) ?? TABS.trade.slug;
      const matchContent = TABS[tabOption] ?? TABS.trade;
      return matchContent.slug;
    }
    return null;
  }, [router.isReady, router.query]);
  const isMarginStandaloneOn = useFeatureFlag("margin-standalone");

  return (
    <>
      <Head>
        <title>Sichain Dex - Margin</title>
      </Head>

      <section className="w-full bg-black py-12 px-24">
        {!isMarginStandaloneOn && (
          <header className="mb-6">
            <h2 className="text-2xl font-bold text-white">Margin</h2>
          </header>
        )}
        {router.isReady && activeTab !== null ? (
          <TabsWithSuspense
            fallbackSuspense={<FlashMessageLoading size="full-page" className="border-gold-800 mt-4 rounded border" />}
            activeTab={activeTab}
            items={TABS_CONTENT}
            renderItem={(title, slug) => (
              <Link href={{ query: { ...router.query, tab: slug } }}>
                <a className="flex py-2">{title}</a>
              </Link>
            )}
          />
        ) : (
          <FlashMessageLoading size="full-page" className="border-gold-800 mt-4 rounded border" />
        )}
      </section>
    </>
  );
};

/**
 * This is a hack for Next.js. Next.js is not a SPA framework, and it server-renders everything by default.
 * Using `dynamic` as default tells Next.js to only render this component in the client side
 * Enabling you to use `useMemo` and others without the Hydration error from Next.js (where the solution requires using useEffect)
 */
export default dynamic(() => Promise.resolve(Margin), {
  ssr: false,
});
