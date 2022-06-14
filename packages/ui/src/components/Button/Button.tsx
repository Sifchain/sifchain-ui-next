import clsx from "clsx";
import { forwardRef } from "react";
import tw from "tailwind-styled-components";

export type ButtonProps = JSX.IntrinsicElements["button"] & {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "tertiary";
};

const StyledButton = tw.button<ButtonProps>`
  rounded-lg font-semibold transition-colors 
  flex items-center justify-center gap-2
  disabled:cursor-not-allowed
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <StyledButton
      {...props}
      ref={ref}
      className={clsx(
        {
          "bg-gray-100 text-gray-900 hover:bg-white active:bg-gray-200 disabled:bg-gray-300":
            variant === "primary",
          "bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-400":
            variant === "secondary",
          "text-xs py-1 px-1.5": size === "xs",
          "text-sm py-1.5 px-2.5": size === "sm",
          "text-sm py-3 px-4": size === "md",
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
