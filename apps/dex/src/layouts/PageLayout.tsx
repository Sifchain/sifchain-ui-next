import React, { FC, PropsWithChildren, ReactNode } from "react";

type Props = {
  breadcrumbs?: ReactNode[];
};

const PageLayout: FC<PropsWithChildren<Props>> = (props) => {
  return (
    <>
      {props.breadcrumbs && (
        <nav className="flex items-center p-4 bg-slate-200 dark:bg-sifgray-900 gap-2">
          {props.breadcrumbs.map((crumb, index) => (
            <span
              className="py-0.5 px-2 rounded text-sifgray-900 dark:text-sifgray-300"
              key={index}
            >
              {crumb}
            </span>
          ))}
        </nav>
      )}
      <div className="p-6 sm:p-12">{props.children}</div>
    </>
  );
};

export default PageLayout;
