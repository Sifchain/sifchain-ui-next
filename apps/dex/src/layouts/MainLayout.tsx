import {
  XMarkIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
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
        <main className="z-[1] flex flex-1 flex-col">{props.children}</main>
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
        closeButton={({ closeToast, ariaLabel = "Close notification" }) => (
          <button onClick={closeToast} type="button" aria-label={ariaLabel}>
            <XMarkIcon className="absolute top-2 right-2 h-[17.5px] w-[17.5px] text-gray-200" />
          </button>
        )}
        icon={({ type }) => {
          switch (type) {
            case "success":
              return <CheckCircleIcon className="h-[17.5px] w-[17.5px] -translate-x-1 text-green-400" />;
            case "info":
              return <InformationCircleIcon className="h-[17.5px] w-[17.5px] -translate-x-1 text-blue-600" />;
            case "error":
              return <XCircleIcon className="h-[17.5px] w-[17.5px] -translate-x-1 text-red-400" />;
            case "warning":
              return <ExclamationCircleIcon className="h-[17.5px] w-[17.5px] -translate-x-1 text-yellow-400" />;
            default:
              return null;
          }
        }}
      />
    </>
  );
};

export default MainLayout;
