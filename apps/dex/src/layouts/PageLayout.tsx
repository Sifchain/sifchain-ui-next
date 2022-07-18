import { ArrowLeftIcon } from "@heroicons/react/outline";
import { SurfaceB } from "@sifchain/ui";
import Head from "next/head";
import { useRouter } from "next/router";
import type { FC, PropsWithChildren, ReactNode } from "react";
import clsx from "clsx";

type Props = {
  className?: string;
  heading?: ReactNode;
  withBackNavigation?: boolean;
  title?: string;
};

const PageLayout: FC<PropsWithChildren<Props>> = (props) => {
  const router = useRouter();

  return (
    <>
      {(props.title || typeof props.heading === "string") && (
        <Head>
          <title>Sichain Dex - {props.title ?? props.heading}</title>
        </Head>
      )}
      <SurfaceB
        className={clsx(
          props.className || "max-w-6xl",
          "rounded-2xl flex-1 mx-auto w-full my-8",
        )}
      >
        <header className="md:flex items-center p-2 gap-2">
          {props.heading && (
            <nav className="flex items-center gap-2">
              {props.withBackNavigation && (
                <BackButton onClick={() => router.back()} />
              )}
              <span className="py-0.5 px-2 rounded text-gray-300 before:content-['/_']">
                {props.heading}
              </span>
            </nav>
          )}
        </header>
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-scroll">
          {props.children}
        </div>
      </SurfaceB>
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
