import type { NextPage } from "next";
import type { ReactNode } from "react";

import { FC, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import clsx from "clsx";

import PageLayout from "~/layouts/PageLayout";

const TAB_ITEMS = [
  {
    title: "Portifolio",
    tab: "portifolio",
    Component: dynamic(() => import("./Portifolio")),
  },
  {
    title: "Trade",
    tab: "trade",
    Component: dynamic(() => import("./Trade")),
  },
];

type TabsProps = {
  activeTab: string;
  items: { title: string; tab: string; Component: any }[];
  loadingFallback: ReactNode;
  children: (SuspendedComponent: ReactNode) => ReactNode;
};

const Tabs: FC<TabsProps> = ({
  items,
  activeTab,
  children,
  loadingFallback,
}) => {
  const currentTab = items.find((item) => item.tab === activeTab);
  const TabContent = currentTab?.Component || null;
  return (
    <>
      <ul className="flex flex-row border-b-2 border-gray-600">
        {items.map(({ title, tab }, index) => {
          const isTabActive = currentTab?.tab === tab;
          return (
            <li
              key={tab}
              className={clsx(
                "text-lg relative border-b-2 border-transparent",
                { "ml-4": index > 0 },
                isTabActive
                  ? "text-white font-bold border-current"
                  : "text-gray-400",
              )}
              style={{
                bottom: "-2px",
              }}
            >
              <Link href={{ query: { tab } }}>
                <a className="flex py-2">{title}</a>
              </Link>
            </li>
          );
        })}
      </ul>
      {children(
        <Suspense fallback={loadingFallback}>
          <TabContent />
        </Suspense>,
      )}
    </>
  );
};

const Margin: NextPage = () => {
  const router = useRouter();
  const activeTab = (router.query["tab"] as string) || "portifolio";
  return (
    <PageLayout heading="Margin">
      <Tabs
        items={TAB_ITEMS}
        activeTab={activeTab}
        loadingFallback="Loading..."
      >
        {(SuspendedComponent) => {
          return <div className="mt-4">{SuspendedComponent}</div>;
        }}
      </Tabs>
    </PageLayout>
  );
};

export default Margin;
