import { FC } from "react";

export type Props = JSX.IntrinsicElements["input"] & {};

const SearchInput: FC<Props> = (props: Props) => {
  return <input {...props} />;
};

SearchInput.defaultProps = {
  type: "search",
};

export default SearchInput;
