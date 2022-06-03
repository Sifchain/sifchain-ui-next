import clsx from "clsx";
import type { FC } from "react";

export type Props = JSX.IntrinsicElements["input"] & {};

export const SearchInput: FC<Props> = ({ className, ...props }) => {
  return (
    <input
      className={clsx(
        "!border-gray-700 !bg-gray-750 !text-gray-50 rounded-xl opacity-90 hover:opacity-100",
      )}
      {...props}
    />
  );
};

SearchInput.defaultProps = {
  type: "search",
};
