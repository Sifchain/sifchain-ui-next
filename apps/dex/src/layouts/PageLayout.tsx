import { ArrowLeftIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import React, { FC, PropsWithChildren, ReactNode } from "react";

type Props = {
  heading?: ReactNode;
  withBackNavigation?: boolean;
};

const PageLayout: FC<PropsWithChildren<Props>> = (props) => {
  const router = useRouter();

  return (
    <>
      {props.heading && (
        <nav className="flex items-center p-4 bg-slate-200 dark:bg-sifgray-900 gap-2">
          {props.withBackNavigation && (
            <button
              onClick={() => router.back()}
              aria-label="navigate to previous page back"
            >
              <a className="flex items-center">
                <ArrowLeftIcon className="h-4 w-4" />
                <span className="ml-2">Back</span>
              </a>
            </button>
          )}
          <span className="py-0.5 px-2 rounded text-sifgray-900 dark:text-sifgray-300 before:content-['/_']">
            {props.heading}
          </span>
        </nav>
      )}
      <div className="p-6">{props.children}</div>
    </>
  );
};

export default PageLayout;
