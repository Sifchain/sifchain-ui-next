import { cloneElement, FC, useState } from "react";
import {
  Placement,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  useRole,
  useDismiss,
} from "@floating-ui/react-dom-interactions";
import { Transition } from "@headlessui/react";

export type TooltipProps = {
  content: string;
  placement?: Placement;
  children: JSX.Element;
};

export const Tooltip: FC<TooltipProps> = ({
  children,
  content,
  placement = "top",
}) => {
  const [open, setOpen] = useState(false);

  const { x, y, reference, floating, strategy, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context),
    useFocus(context),
    useRole(context, { role: "tooltip" }),
    useDismiss(context),
  ]);

  const floatingProps = getFloatingProps({
    ref: floating,
    className:
      "bg-gray-800 text-gray-50 rounded p-1 px-1.5 text-xs shadow-sm shadow-white/20",
    style: {
      position: strategy,
      top: y ?? "",
      left: x ?? "",
    },
  });

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({ ref: reference, ...children.props }),
      )}
      <Transition
        show={open}
        enter="transition-all duration-75 ease-in-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-all duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        as="span"
        {...floatingProps}
      >
        {content}
      </Transition>
    </>
  );
};
