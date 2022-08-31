import type { ComponentType, ReactNode } from "react";

import { FC, Suspense } from "react";

import clsx from "clsx";

import { FlashMessageLoading } from "../FlashMessages";

export type TabsWithSuspenseProps = {
  activeTab: string;
  items: {
    title: string;
    slug: string;
    /**
     * @TODO I could not find a better type here (e.g., JSX.Elements, ReactNode did not worked)
     */
    content: ComponentType<Record<string, unknown>>;
  }[];
  renderItem: (title: string, slug: string) => ReactNode;
  fallbackSuspense?: ReactNode;
};

export const TabsWithSuspense: FC<TabsWithSuspenseProps> = ({
  activeTab,
  items,
  renderItem,
  fallbackSuspense = <FlashMessageLoading size="full-page" />,
}) => {
  const currentTab = items.find((item) => item.slug === activeTab);
  const TabContent = currentTab?.content || null;
  return (
    <>
      <ul className="flex flex-row border-b border-gray-600">
        {items.map(({ title, slug }, index) => {
          const isTabActive = currentTab?.slug === slug;
          return (
            <li
              key={slug}
              className={clsx(
                "relative -mb-[1px] border-b border-transparent text-lg",
                { "ml-4": index > 0 },
                isTabActive ? "border-current font-bold text-white" : "text-gray-400",
              )}
            >
              {renderItem(title, slug)}
            </li>
          );
        })}
      </ul>
      {TabContent && (
        <Suspense fallback={fallbackSuspense}>
          <TabContent />
        </Suspense>
      )}
    </>
  );
};
