import { ArrowLeftIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import React, { FC, PropsWithChildren, ReactNode } from "react";
import GlobalSearch from "~/compounds/GlobalSearch";

type Props = {
  heading?: ReactNode;
  withBackNavigation?: boolean;
};

const PageLayout: FC<PropsWithChildren<Props>> = (props) => {
  const router = useRouter();

  return (
    <>
      <header className="md:flex items-center p-2 bg-slate-200 dark:bg-sifgray-900 gap-2">
        {props.heading && (
          <nav className="flex items-center gap-2">
            {props.withBackNavigation && (
              <BackButton onClick={() => router.back()} />
            )}
            <span className="py-0.5 px-2 rounded text-sifgray-900 dark:text-sifgray-300 before:content-['/_']">
              {props.heading}
            </span>
          </nav>
        )}
      </header>
      <div className="p-6 overflow-y-scroll flex-1">{props.children}</div>
    </>
  );
};

const BackButton: FC<JSX.IntrinsicElements["button"]> = ({ onClick }) => (
  <button onClick={onClick} aria-label="navigate to previous page back">
    <a className="flex items-center">
      <ArrowLeftIcon className="h-4 w-4" />
      <span className="ml-2">Back</span>
    </a>
  </button>
);

export default PageLayout;
