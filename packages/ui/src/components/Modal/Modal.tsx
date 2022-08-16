import { Fragment, PropsWithChildren, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowLeftIcon, XIcon } from "@heroicons/react/outline";
import type { FC } from "react";
import clsx from "clsx";

export type ModalProps = PropsWithChildren<{
  isOpen: boolean;
  title?: ReactNode;
  subTitle?: ReactNode;
  hideCloseButton?: boolean;
  className?: string;
  onClose: (isOpen: boolean) => void;
  onGoBack?: null | undefined | (() => void);
  titlePlacement?: "left" | "center";
  onTransitionEnd?: () => void;
}>;

export const Modal: FC<ModalProps> = (props) => {
  return (
    <Transition.Root show={props.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => {
            props.onTransitionEnd?.();
          }}
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  "relative w-full transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all dark:bg-gray-800 dark:text-white sm:my-8 md:w-auto",
                  props.className,
                )}
              >
                {!props.hideCloseButton && (
                  <div className="absolute top-0 right-0 z-10 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none dark:bg-gray-800"
                      onClick={props.onClose.bind(null, false)}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
                <header className="grid gap-2 py-4">
                  <div className="flex gap-2">
                    {typeof props.onGoBack === "function" && (
                      <button className="-my-4 -mr-4 p-4 text-gray-50" onClick={props.onGoBack}>
                        <ArrowLeftIcon className="h-6 w-6" />
                      </button>
                    )}
                    <Dialog.Title
                      as="h3"
                      className="relative px-4 text-center text-xl font-semibold leading-6 text-gray-900 dark:text-gray-50"
                    >
                      {props.title}
                    </Dialog.Title>
                  </div>
                  {props.subTitle && <div className="border-gray-750 border-b p-4 pt-0 ">{props.subTitle}</div>}
                </header>
                <div className="p-4">{props.children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
