import clsx from "clsx";
import type { FC, SVGProps } from "react";
import { SifchainLogoSmall } from "./icons";

export const Logo: FC<SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <SifchainLogoSmall className={clsx("text-8xl", className)} {...props} />
);
