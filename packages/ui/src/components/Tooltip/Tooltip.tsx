/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
  title?: string;
  content: string;
  children: JSX.Element;
  placement?: Placement;
};

const DEFAULT_PLACEMENT: Placement = "top";

export const Tooltip: FC<TooltipProps> = (props) => {
  const [open, setOpen] = useState(false);

  const arrowRef = useRef<HTMLDivElement>(null);

  const { x, y, reference, floating, strategy, context, middlewareData, placement } = useFloating({
    placement: props.placement ?? "top",
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
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
    }[placement.split("-")[0] ?? DEFAULT_PLACEMENT];

    return {
      left: arrowX != null ? `${arrowX}px` : "",
      top: arrowY != null ? `${arrowY}px` : "",
      [staticSide ?? DEFAULT_PLACEMENT]: "-4px",
    };
  }, [middlewareData.arrow, placement]);

  return (
    <>
      {cloneElement(props.children, getReferenceProps({ ref: reference, ...props.children.props }))}
      <Transition
        show={open}
        enter="transition-all duration-75 ease-in-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-all duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        as="div"
        className="grid gap-1 whitespace-normal rounded bg-gray-700 p-2 px-3 text-xs font-normal text-gray-200"
        {...floatingProps}
      >
        {props.title && <div className="flex font-semibold text-gray-100">{props.title}</div>}
        <div className="max-w-sm">{props.content}</div>
        <span className="absolute h-2 w-2 rotate-45 bg-gray-700" ref={arrowRef} style={arrowStyle} />
      </Transition>
    </>
  );
};

Tooltip.defaultProps = {
  placement: DEFAULT_PLACEMENT,
};
