import Head from "next/head";
import type { FC, PropsWithChildren } from "react";
import tw from "tailwind-styled-components";

import Sidebar from "./Sidebar";

export type Props = PropsWithChildren<{
  title?: string;
}>;

const Shell = tw.div`
  min-h-screen w-full bg-slate-100 flex
  dark:bg-gradient-to-b
  dark:from-gray-900 dark:to-gray-900/95 dark:text-slate-100 
  subpixel-antialiased
`;

const MainLayout: FC<Props> = (props) => {
  return (
    <>
      {props.title && (
        <Head>
          <title>Sichain Dex - {props.title}</title>
        </Head>
      )}
      <figure className="bg-forest bg-cover bg-center absolute inset-0 z-0 opacity-30 blur-sm pointer-events-none" />
      <Shell>
        <Sidebar />
        <main className="flex-1 flex flex-col max-h-screen z-[1]">
          {props.children}
        </main>
      </Shell>
    </>
  );
};

export default MainLayout;
