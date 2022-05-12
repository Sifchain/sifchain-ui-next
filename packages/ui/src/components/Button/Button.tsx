import clsx from "clsx";
import { FC } from "react";

export type Props = JSX.IntrinsicElements["button"] & {
  primary?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
};

const Button: FC<Props> = (props) => (
  <button
    {...props}
    className={clsx("bg-slate-300 rounded-lg place-items-center", {
      "bg-indigo-500 text-white": props.primary,
      "text-xs py-1 px-1.5": props.size === "xs",
      "text-sm py-1.5 px-2.5": props.size === "sm",
      "text-base py-2 px-3": props.size === "md",
      "text-lg py-2.5 px-4": props.size === "lg",
    })}
  >
    {props.children}
  </button>
);

Button.defaultProps = {
  primary: false,
  size: "md",
};

export default Button;
