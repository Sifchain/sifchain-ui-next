import clsx from "clsx";
import { forwardRef } from "react";

export type ButtonProps = JSX.IntrinsicElements["button"] & {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "tertiary";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      {...props}
      ref={ref}
      className={clsx(
        "rounded-lg place-items-center font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2",
        {
          "bg-gray-100 text-gray-900 hover:bg-white active:bg-gray-200 disabled:bg-gray-300":
            props.variant === "primary",
          "bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-400":
            props.variant === "secondary",
          "text-xs py-1 px-1.5": props.size === "xs",
          "text-sm py-1.5 px-2.5": props.size === "sm",
          "text-sm py-3 px-4": props.size === "md",
          "text-md py-4 px-5": props.size === "lg",
        },
        className,
      )}
    >
      {props.children}
    </button>
  ),
);

Button.defaultProps = {
  size: "md",
  variant: "primary",
};
