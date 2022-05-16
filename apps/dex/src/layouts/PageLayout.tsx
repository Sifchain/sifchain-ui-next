import React, { FC, PropsWithChildren, ReactNode } from "react";

type Props = {
  heading?: ReactNode;
};

const PageLayout: FC<PropsWithChildren<Props>> = (props) => {
  return (
    <>
      {props.heading && (
        <nav className="flex items-center p-4 bg-slate-200 dark:bg-sifgray-900 gap-2">
          <span className="py-0.5 px-2 rounded text-sifgray-900 dark:text-sifgray-300 before:content-['/_']">
            {props.heading}
          </span>
        </nav>
      )}
      <div className="p-6 sm:p-8">{props.children}</div>
    </>
  );
};

export default PageLayout;
