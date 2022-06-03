import clsx from "clsx";
import { forwardRef } from "react";

export type ButtonProps = JSX.IntrinsicElements["button"] & {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "tertiary";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <button
      {...props}
      ref={ref}
      className={clsx("bg-gray-200 rounded-lg place-items-center", {
        "bg-indigo-600 dark:bg-slate-300 text-gray-50":
          props.variant === "primary",
        "text-xs py-1 px-1.5": props.size === "xs",
        "text-sm py-1.5 px-2.5": props.size === "sm",
        "text-base py-2 px-3": props.size === "md",
        "text-lg py-2.5 px-4": props.size === "lg",
      })}
    >
      {props.children}
    </button>
  ),
);

Button.defaultProps = {
  size: "md",
};
