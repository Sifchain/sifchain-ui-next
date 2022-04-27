import clsx from "clsx";
import Head from "next/head";
import React, { FC, PropsWithChildren, useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/outline";

export type Props = PropsWithChildren<{
  title?: string;
}>;

const Aside = () => {
  const [isOpen, setOpen] = useState(false);

  const handleBtn = (
    <button
      onClick={() => setOpen(!isOpen)}
      className={clsx(
        "h-8 w-8 p-1 rounded-r-md bg-pink-600 absolute top-1.5 right-0 translate-x-[100%]",
        "transition-transform",
        {
          "translate-x-0 bg-white -scale-x-[1] text-pink-500": isOpen,
        },
      )}
    >
      <ChevronRightIcon />
    </button>
  );

  return (
    <aside
      className={clsx(
        [
          "fixed w-full md:max-w-xs h-screen transition-transform ease-out",
          "bg-pink-300 dark:bg-pink-600",
        ],
        {
          "-translate-x-[100%]": !isOpen,
          "md:block md:relative": isOpen,
        },
      )}
    >
      {handleBtn}
      menu goes here
    </aside>
  );
};

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
        <section className="grid flex-1 bg-slate-200 dark:bg-slate-800 border border-pink-600">
          <header></header>
          <main>{props.children}</main>
          <footer className="p-4 grid place-items-center">
            <p>
              made with <span className="text-red-500">❤</span> by sif core team
            </p>
          </footer>
        </section>
      </div>
    </>
  );
};

export default MainLayout;
