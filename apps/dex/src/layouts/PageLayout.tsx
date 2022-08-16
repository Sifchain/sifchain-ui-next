import { ArrowLeftIcon } from "@heroicons/react/outline";
import { SurfaceB } from "@sifchain/ui";
import Head from "next/head";
import { useRouter } from "next/router";
import type { FC, PropsWithChildren, ReactNode } from "react";

type Props = {
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
      <SurfaceB className="mx-auto my-8 w-full max-w-6xl flex-1 rounded-2xl">
        <header className="items-center gap-2 p-2 md:flex">
          {props.heading && (
            <nav className="flex items-center gap-2">
              {props.withBackNavigation && (
                <BackButton onClick={() => router.back()} />
              )}
              <span className="rounded py-0.5 px-2 text-gray-300 before:content-['/_']">
                {props.heading}
              </span>
            </nav>
          )}
        </header>
        <div className="max-h-[calc(100vh-200px)] overflow-y-scroll p-6">
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
