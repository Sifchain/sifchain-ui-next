import React, { FC, PropsWithChildren, ReactNode } from "react";

type Props = {
  breadcrumbs?: ReactNode[];
};

const PageLayout: FC<PropsWithChildren<Props>> = (props) => {
  return (
    <>
      {props.breadcrumbs && (
        <nav className="flex items-center p-4 bg-gray-900 gap-2">
          {props.breadcrumbs.map((crumb, index) => (
            <span
              className="p-1` px-1.5 rounded bg-gray-800 text-gray-300"
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
