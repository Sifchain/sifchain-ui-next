import type { ReactNode } from "react";

import { FC, Suspense } from "react";

import clsx from "clsx";

export type TabsWithSuspenseProps = {
  activeTab: string;
  items: {
    title: string;
    slug: string;
    content: any; // TODO: I could not find a better type here (e.g., JSX.Elements did not worked)
  }[];
  loadingFallback: ReactNode;
  renderItem: (title: string, slug: string) => ReactNode;
};

export const TabsWithSuspense: FC<TabsWithSuspenseProps> = ({
  activeTab,
  items,
  loadingFallback,
  renderItem,
}) => {
  const currentTab = items.find((item) => item.slug === activeTab);
  const TabContent = currentTab?.content || null;
  return (
    <>
      <ul className="flex flex-row border-b-2 border-gray-600">
        {items.map(({ title, slug }, index) => {
          const isTabActive = currentTab?.slug === slug;
          return (
            <li
              key={slug}
              className={clsx(
                "text-lg relative border-b-2 border-transparent -mb-0.5",
                { "ml-4": index > 0 },
                isTabActive
                  ? "text-white font-bold border-current"
                  : "text-gray-400",
              )}
            >
              {renderItem(title, slug)}
            </li>
          );
        })}
      </ul>
      {TabContent && (
        <Suspense fallback={loadingFallback}>
          <TabContent />
        </Suspense>
      )}
    </>
  );
};
