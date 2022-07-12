import type { NextPage } from "next";

import { Suspense } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Link from "next/link";

const DEFAULT_OPTION_ITEM = "open-positions";
const OPTIONS_ITEMS = [
  {
    title: "Open Positions",
    slug: "open-positions",
    content: dynamic(() => import("~/compounds/Margin/OpenPositions")),
  },
  {
    title: "History",
    slug: "history",
    content: dynamic(() => import("~/compounds/Margin/History")),
  },
];

const Portifolio: NextPage = () => {
  const router = useRouter();
  const activeOption =
    (router.query["option"] as string) || DEFAULT_OPTION_ITEM;
  const currentTab = OPTIONS_ITEMS.find((item) => item.slug === activeOption);
  const TabContent = currentTab?.content || null;

  return (
    <section className="mt-4 rounded bg-gray-800">
      <ul className="flex flex-row">
        {OPTIONS_ITEMS.map(({ title, slug }) => {
          const isTabActive = currentTab?.slug === slug;
          return (
            <li key={slug}>
              <Link href={{ query: { ...router.query, option: slug } }}>
                <a
                  className={clsx(
                    "flex mx-4 py-3",
                    isTabActive ? "text-white border-current" : "text-gray-400",
                  )}
                >
                  {title}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
      {TabContent && (
        <Suspense
          fallback={
            <div className="bg-gray-850 p-10 text-center">Loading...</div>
          }
        >
          <TabContent />
        </Suspense>
      )}
    </section>
  );
};

export default Portifolio;
