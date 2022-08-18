import type { OpenPositionsTableProps } from "~/compounds/Margin/OpenPositionsTable";

import { Suspense, useMemo } from "react";
import { useRouter } from "next/router";
import { pathOr, path } from "ramda";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Link from "next/link";

const SLUGS = {
  openPositions: "openPositions",
  history: "history",
} as const;
const OPTIONS_ITEMS = {
  [SLUGS.openPositions]: {
    title: "Open Positions",
    slug: SLUGS.openPositions,
    content: dynamic(() => import("~/compounds/Margin/OpenPositionsTable"), {
      suspense: true,
    }),
  },
  [SLUGS.history]: {
    title: "History",
    slug: SLUGS.history,
    content: dynamic(() => import("~/compounds/Margin/HistoryTable"), {
      suspense: true,
    }),
  },
} as const;

type PortfolioTableProps = {
  walletAddress: string | undefined;
  extraQuerystring?: ReturnType<typeof useRouter>["query"];
  openPositions?: {
    hideColumns: OpenPositionsTableProps["hideColumns"];
  };
};
export const PortfolioTable = (props: PortfolioTableProps) => {
  const router = useRouter();
  const qsTab: string | undefined = path(["tab"], router.query);
  const qsOption = pathOr(SLUGS.openPositions, ["option"], router.query);

  /**
   * @TODO Silently fallback to "OpenPositions" in case the querystring doesn't match any slugs
   *   - In this scenario, the URL will be stale but internal state is corrcect
   *   - As an improvement, we could use `router.push` to update the URL as well
   */
  const currentTab = useMemo(() => {
    if (SLUGS[qsOption]) {
      return OPTIONS_ITEMS[qsOption];
    }
    return OPTIONS_ITEMS[SLUGS.openPositions];
  }, [qsOption]);

  const TabContent = currentTab.content;
  const slugProps = props[currentTab.slug];
  const qs = props.extraQuerystring || {};

  return (
    <div className="relative">
      <ul className="flex flex-row bg-gray-800 text-sm">
        {Object.values(OPTIONS_ITEMS).map(({ slug, title }) => {
          const isTabActive = currentTab.slug === slug;

          return (
            <li key={slug}>
              <Link href={{ query: { ...qs, tab: qsTab, option: slug } }} scroll={false}>
                <a className={clsx("mx-4 flex py-3", isTabActive ? "font-semibold text-white" : "text-gray-400")}>
                  {title}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
      {TabContent && (
        <Suspense fallback={<div className="bg-gray-850 p-10 text-center text-gray-100">Loading...</div>}>
          {props.walletAddress ? (
            <TabContent
              {...slugProps}
              classNamePaginationContainer="absolute right-0 top-0"
              walletAddress={props.walletAddress}
            />
          ) : (
            <div className="bg-gray-850 p-10 text-center text-gray-100">Connect your Sifchain wallet.</div>
          )}
        </Suspense>
      )}
    </div>
  );
};
