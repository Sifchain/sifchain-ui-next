import React, { FC, PropsWithChildren, ReactNode } from "react";

type Props = {
  breadcrumbs?: ReactNode[];
};

const PageLayout: FC<PropsWithChildren<Props>> = (props) => {
  return (
    <>
      {props.breadcrumbs && (
        <nav className="flex items-center p-4 bg-slate-200 dark:bg-gray-900 gap-2">
          {props.breadcrumbs.map((crumb, index) => (
            <span
              className="py-0.5 px-2 rounded bg-gray-400/30 text-gray-900 dark:text-gray-300"
              key={index}
            >
              {crumb}
            </span>
          ))}
        </nav>
      )}
      {props.children}
    </>
  );
};

export default PageLayout;
