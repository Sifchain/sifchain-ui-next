import Head from "next/head";
import React, { FC, PropsWithChildren } from "react";
import Aside from "./Aside";
import Footer from "./Footer";

export type Props = PropsWithChildren<{
  title?: string;
}>;

const MainLayout: FC<Props> = (props) => {
  return (
    <>
      {props.title && (
        <Head>
          <title>{props.title}</title>
        </Head>
      )}
      <div className="min-h-screen bg-slate-100 flex dark:bg-slate-900 dark:text-slate-100">
        <Aside />
        <section className="flex flex-col flex-1">
          <main className="flex-1 border">{props.children}</main>
          <Footer />
        </section>
      </div>
    </>
  );
};

export default MainLayout;
