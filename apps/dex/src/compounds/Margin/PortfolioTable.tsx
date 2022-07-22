import { Suspense } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Link from "next/link";

import type { HideColsUnion } from "./OpenPositionsTable";

const DEFAULT_OPTION_ITEM = "open-positions";
const OPTIONS_ITEMS = [
  {
    title: "Open Positions",
    slug: "open-positions",
    content: dynamic(() => import("~/compounds/Margin/OpenPositionsTable"), {
      suspense: true,
    }),
  },
  {
    title: "History",
    slug: "history",
    content: dynamic(() => import("~/compounds/Margin/HistoryTable"), {
      suspense: true,
    }),
  },
];
type PortfolioTableProps = {
  openPositions?: {
    hideCols?: HideColsUnion[];
  };
};
export const PortfolioTable = (props: PortfolioTableProps) => {
  const router = useRouter();
  const activeOption =
    (router.query["option"] as string) || DEFAULT_OPTION_ITEM;
  const currentTab = OPTIONS_ITEMS.find((item) => item.slug === activeOption);
  const TabContent = currentTab?.content || null;

  return (
    <>
      <ul className="flex flex-row text-sm bg-gray-800 rounded-tl rounded-tr">
        {OPTIONS_ITEMS.map(({ title, slug }) => {
          const isTabActive = currentTab?.slug === slug;
          return (
            <li key={slug}>
              <Link href={{ query: { ...router.query, option: slug } }}>
                <a
                  className={clsx(
                    "flex mx-4 py-3",
                    isTabActive ? "text-white font-semibold" : "text-gray-400",
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
        <Suspense>
          <TabContent {...props.openPositions} />
        </Suspense>
      )}
    </>
  );
};
