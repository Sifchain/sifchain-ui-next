import clsx from "clsx";
import { forwardRef } from "react";
import tw from "tailwind-styled-components";

export type LabelProps = JSX.IntrinsicElements["button"] & {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "tertiary";
};

const StyledLabel = tw.button<LabelProps>`
  transition-colors
  text-xs font-semibold text-white md:text-md
  bg-gray-600 px-2 py-1
  border-gray-500 rounded
  hover:bg-gray-500 hover:border-gray-300
  active:bg-gray-400 active:border-gray-300
`;

export const Label = forwardRef<HTMLButtonElement, LabelProps>(
  ({ className, variant, size, ...props }, ref) => (
    <StyledLabel
      {...props}
      ref={ref}
      className={clsx({
        "rounded-full": variant === "primary",
      })}
    >
      {props.children}
    </StyledLabel>
  ),
);

Label.defaultProps = {
  size: "md",
  variant: "primary",
};
