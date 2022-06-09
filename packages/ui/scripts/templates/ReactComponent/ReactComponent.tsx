import type { FC } from "react";
import tw from "tailwind-styled-components";

const StyledWrapper = tw.div``;

export type ReactComponentProps = {};

export const ReactComponent: FC<ReactComponentProps> = (props) => {
  return <StyledWrapper>ReactComponent</StyledWrapper>;
};
