import { Transition } from "@headlessui/react";
import { FC, Fragment, PropsWithChildren } from "react";

export type TransitionProps = PropsWithChildren<{
  appear?: boolean;
  show?: boolean;
}>;

export const AppearTransition: FC<TransitionProps> = ({
  children,
  ...props
}) => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-200"
    enterFrom="opacity-0 translate-y-1"
    enterTo="opacity-100 translate-y-0"
    leave="transition ease-in duration-150"
    leaveFrom="opacity-100 translate-y-0"
    leaveTo="opacity-0 translate-y-1"
    {...props}
  >
    {children}
  </Transition>
);
