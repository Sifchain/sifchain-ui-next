import { Suspense } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Link from "next/link";

import type { OpenPositionsTableProps } from "~/compounds/Margin/OpenPositionsTable";

const DEFAULT_OPTION_ITEM = "openPositions";
const OPTIONS_ITEMS = [
  {
    title: "Open Positions",
    slug: DEFAULT_OPTION_ITEM,
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
  queryId: string;
  openPositions?: {
    hideColumns: OpenPositionsTableProps["hideColumns"];
  };
  [key: string]: unknown;
};
export const PortfolioTable = (props: PortfolioTableProps) => {
  const router = useRouter();
  const qsTab = router.query["tab"] as string;
  const qsOption = router.query["option"] as string;
  const option = qsOption || DEFAULT_OPTION_ITEM;
  const currentTab = OPTIONS_ITEMS.find(({ slug }) => slug === option) as any;
  const TabContent = currentTab.content;
  const slugProps = props[currentTab.slug] as any;

  return (
    <>
      <ul className="flex flex-row text-sm  bg-gray-800">
        {OPTIONS_ITEMS.map(({ title, slug }) => {
          const isTabActive = currentTab?.slug === slug;
          return (
            <li key={slug}>
              <Link
                href={{ query: { tab: qsTab, option: slug } }}
                scroll={false}
              >
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
        <Suspense
          fallback={
            <div className="bg-gray-850 p-10 text-center text-gray-100">
              Loading...
            </div>
          }
        >
          <TabContent {...slugProps} queryId={props.queryId} />
        </Suspense>
      )}
    </>
  );
};
