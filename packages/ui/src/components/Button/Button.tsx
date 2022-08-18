import clsx from "clsx";
import { forwardRef } from "react";
import tw from "tailwind-styled-components";

export type ButtonProps = JSX.IntrinsicElements["button"] & {
  as?: "button" | "a";
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "tertiary" | "outline";
};

const StyledButton = tw.button<ButtonProps>`
  rounded-lg font-semibold transition-colors 
  flex items-center justify-center gap-2
  disabled:cursor-not-allowed
  cursor-pointer
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ as = "button", className, variant, size, ...props }, ref) => (
    <StyledButton
      {...props}
      $as={as}
      ref={ref}
      className={clsx(
        {
          "bg-gray-100 text-gray-900 hover:bg-white active:bg-gray-200 disabled:bg-gray-300": variant === "primary",
          "bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-400": variant === "secondary",
          "ring-2 ring-white": variant === "outline",
          "py-1 px-1.5 text-xs": size === "xs",
          "py-1.5 px-2.5 text-sm": size === "sm",
          "py-3 px-4 text-sm": size === "md",
          "text-md py-4 px-5": size === "lg",
        },
        className,
      )}
    >
      {props.children}
    </StyledButton>
  ),
);

Button.defaultProps = {
  size: "md",
  variant: "primary",
};
