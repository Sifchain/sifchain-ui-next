import {
  XIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";
import { ToastContainer } from "@sifchain/ui";
import type { FC, PropsWithChildren } from "react";
import tw from "tailwind-styled-components";

import Header from "./Header";

const Shell = tw.div`
  flex flex-col
  min-h-screen w-full bg-black
  text-slate-100
  subpixel-antialiased
  bg-cover bg-center bg-no-repeat bg-fixed
`;

export type Props = PropsWithChildren;

const MainLayout: FC<Props> = (props) => {
  return (
    <>
      <Shell>
        <Header />
        <main className="flex-1 flex flex-col z-[1]">{props.children}</main>
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
