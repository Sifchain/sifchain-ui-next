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
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
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
                  "relative bg-white dark:bg-gray-800 dark:text-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full",
                  props.className,
                )}
              >
                {!props.hideCloseButton && (
                  <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4 z-10">
                    <button
                      type="button"
                      className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={props.onClose.bind(null, false)}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
                <header className="grid gap-2 py-4">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-xl relative text-center px-4 leading-6 font-semibold text-gray-900 dark:text-gray-50"
                    >
                      {props.title}
                    </Dialog.Title>
                    {typeof props.onGoBack === "function" && (
                      <button
                        className="text-gray-50 absolute top-0 right-4"
                        onClick={props.onGoBack}
                      >
                        <ArrowLeftIcon className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                  {props.subTitle && (
                    <div className="p-4 pt-0 border-b border-gray-750 ">
                      {props.subTitle}
                    </div>
                  )}
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
