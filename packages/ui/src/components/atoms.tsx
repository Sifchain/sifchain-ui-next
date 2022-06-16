import clsx from "clsx";
import type { FC, SVGProps } from "react";
import tw from "tailwind-styled-components";
import { SifchainLogoSmall } from "./icons";

export const Logo: FC<SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <SifchainLogoSmall className={clsx("text-6xl", className)} {...props} />
);

export const Select = tw.select`
  border border-gray-300 rounded-lg p-2
`;
