import type { FC } from "react";

export type Props = JSX.IntrinsicElements["input"] & {};

export const SearchInput: FC<Props> = (props: Props) => {
  return <input {...props} />;
};

SearchInput.defaultProps = {
  type: "search",
};
