import type { FC, SVGProps } from "react";
import { SortAscendingIcon, SortDescendingIcon, SortUnderterminedIcon } from "../icons";

export type SortIconProps = SVGProps<SVGSVGElement> & {
  active: boolean;
  sortDirection: "asc" | "desc";
};

export const SortIcon: FC<SortIconProps> = ({ active, sortDirection, ...svgProps }) => {
  if (!active) {
    return <SortUnderterminedIcon {...svgProps} />;
  }
  return sortDirection === "asc" ? <SortAscendingIcon {...svgProps} /> : <SortDescendingIcon {...svgProps} />;
};

SortIcon.defaultProps = {
  active: false,
};
