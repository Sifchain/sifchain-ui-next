import { cloneElement, FC, useMemo, useRef, useState } from "react";
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
  arrow,
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

  const arrowRef = useRef<HTMLDivElement>(null);

  const {
    x,
    y,
    reference,
    floating,
    strategy,
    context,
    middlewareData,
    placement: finalPlacement,
  } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(5),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
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
    style: {
      position: strategy,
      top: y ?? "",
      left: x ?? "",
    },
  });

  const arrowStyle = useMemo(() => {
    const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {
      x: null,
      y: null,
    };

    const staticSide = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    }[finalPlacement.split("-")[0] ?? "top"];

    return {
      left: arrowX != null ? `${arrowX}px` : "",
      top: arrowY != null ? `${arrowY}px` : "",
      [staticSide ?? "top"]: "-4px",
    };
  }, [middlewareData.arrow, finalPlacement]);

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
        as="div"
        className="bg-gray-700 text-gray-200 font-normal rounded p-2 px-3 text-xs"
        {...floatingProps}
      >
        {content}
        <span
          className="absolute w-2 h-2 bg-gray-700 rotate-45"
          ref={arrowRef}
          style={arrowStyle}
        />
      </Transition>
    </>
  );
};
