import { ThemeSwitcher } from "@sifchain/ui";
import Head from "next/head";
import React, { FC, PropsWithChildren } from "react";
import tw from "tailwind-styled-components";

import Sidebar from "./Sidebar";

export type Props = PropsWithChildren<{
  title?: string;
}>;

const Shell = tw.div`
  min-h-screen w-full bg-slate-100 flex 
  dark:bg-slate-900/95 dark:text-slate-100 subpixel-antialiased
`;

const MainLayout: FC<Props> = (props) => {
  return (
    <>
      {props.title && (
        <Head>
          <title>Sichain Dex - {props.title}</title>
        </Head>
      )}
      <ThemeSwitcher />
      <Shell>
        <Sidebar />
        <main className="flex-1 flex flex-col max-h-screen">
          {props.children}
        </main>
      </Shell>
    </>
  );
};

export default MainLayout;
