import { ExternalLink, FlashMessageLoading, Modal, TabsWithSuspense, TabsWithSuspenseProps } from "@sifchain/ui";
import { useLocalStorageState } from "@sifchain/utils/react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useFeatureFlag, withRedirectOnMount } from "~/lib/featureFlags";

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

const INFO_MODAL_STORAGE_KEY = "@sifchain/margin-info-modal";

const Margin: NextPage = () => {
  const router = useRouter();
  const isMarginStandaloneOn = useFeatureFlag("margin-standalone");
  const [isModalOpen, setIsModalOpen] = useLocalStorageState(INFO_MODAL_STORAGE_KEY, true);
  const onModalClose = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);
  const activeTab = useMemo(() => {
    if (router.isReady) {
      const tabOption = (router.query["tab"] as keyof typeof TABS) ?? TABS.trade.slug;
      const matchContent = TABS[tabOption] ?? TABS.trade;
      return matchContent.slug;
    }
    return null;
  }, [router.isReady, router.query]);
  const qsPool = router.query["pool"] ? { pool: router.query["pool"] } : {};

  return (
    <>
      <Head>
        <title>Sichain Dex - Margin</title>
      </Head>

      <section className="mx-auto w-full bg-black p-4 md:container">
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
              <Link href={{ query: { tab: slug, ...qsPool } }} className="flex py-2">
                {title}
              </Link>
            )}
          />
        ) : (
          <FlashMessageLoading size="full-page" className="border-gold-800 mt-4 rounded border" />
        )}
      </section>

      <Modal
        title={
          <>
            Welcome to Margin Trading v1.0
            <br />
            The Long Game!
          </>
        }
        isOpen={isModalOpen}
        onClose={onModalClose}
      >
        <p className="text-center text-lg">
          <span>
            v1.0 allows for longing ROWAN against TKN. To see all of v1.0 features along with the upcoming roadmap for
            Margin, please reference our product documentation&nbsp;
          </span>
          <ExternalLink
            href="https://sifchain.notion.site/Margin-Trading-v1-0-The-Long-Game-63fe6f60e8094a458047595e4ce18eb9"
            className="underline hover:opacity-50"
          >
            here
          </ExternalLink>
        </p>
      </Modal>
    </>
  );
};

/**
 * This is a hack for Next.js. Next.js is not a SPA framework, and it server-renders everything by default.
 * Using `dynamic` as default tells Next.js to only render this component in the client side
 * Enabling you to use `useMemo` and others without the Hydration error from Next.js (where the solution requires using useEffect)
 */
export default dynamic(
  () =>
    Promise.resolve(
      withRedirectOnMount(Margin, {
        redirectTo: "/",
        redirectIf(ctx) {
          return ctx.flags.has("margin") === false || ctx.flags.has("margin-standalone") === false;
        },
        fallback: (
          <div className="mx-auto w-full max-w-6xl bg-black">
            <FlashMessageLoading size="full-page" className="border-gold-800 mt-4 rounded border" />
          </div>
        ),
      }) as any,
    ),
  {
    ssr: false,
  },
);
