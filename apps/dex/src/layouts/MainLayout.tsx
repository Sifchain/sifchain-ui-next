import {
  XIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";
import { ToastContainer } from "@sifchain/ui";
import Head from "next/head";
import type { FC, PropsWithChildren } from "react";
import tw from "tailwind-styled-components";

import Background from "./BackgroundImage";

import Sidebar from "./Sidebar";

const Shell = tw.div`
min-h-screen w-full bg-slate-100 flex
dark:bg-gradient-to-b
dark:from-gray-900 dark:to-gray-900/95 dark:text-slate-100 
subpixel-antialiased
`;

export type Props = PropsWithChildren<{}>;

const MainLayout: FC<Props> = (props) => {
  return (
    <>
      <Background $opacity={20} />
      <Shell>
        <Sidebar />
        <main className="flex-1 flex flex-col max-h-screen z-[1]">
          {props.children}
        </main>
      </Shell>
      <ToastContainer
        hideProgressBar
        toastClassName={`
          !border-gray-700 !bg-gray-750 
          !rounded !border 
          !text-gray-200 !p-4 relative
        `}
        position="top-right"
        limit={4}
        draggablePercent={60}
        closeButton={
          <XIcon className="absolute top-2 right-2 h-[17.5px] w-[17.5px] text-gray-200" />
        }
        icon={({ type }) => {
          switch (type) {
            case "success":
              return (
                <CheckCircleIcon className="-translate-x-1 h-[17.5px] w-[17.5px] text-green-400" />
              );
            case "info":
              return (
                <InformationCircleIcon className="-translate-x-1 h-[17.5px] w-[17.5px] text-blue-600" />
              );
            case "error":
              return (
                <XCircleIcon className="-translate-x-1 h-[17.5px] w-[17.5px] text-red-400" />
              );
            case "warning":
              return (
                <ExclamationCircleIcon className="-translate-x-1 h-[17.5px] w-[17.5px] text-yellow-400" />
              );
            default:
              return null;
          }
        }}
      />
    </>
  );
};

export default MainLayout;
