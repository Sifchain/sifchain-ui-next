import clsx from "clsx";
import type { FC } from "react";

export type Props = JSX.IntrinsicElements["input"] & {};

export const SearchInput: FC<Props> = ({ className, ...props }) => {
  return (
    <input
      className={clsx(
        "!border-sifgray-700 !bg-sifgray-750 !text-sifgray-50 rounded-xl opacity-90 hover:opacity-100",
      )}
      {...props}
    />
  );
};

SearchInput.defaultProps = {
  type: "search",
};
