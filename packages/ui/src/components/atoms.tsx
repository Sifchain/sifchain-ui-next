import clsx from "clsx";
import type { FC, SVGProps } from "react";
import tw from "tailwind-styled-components";

import { SifchainLogoSmall, SifchainLogo } from "./icons";

export const Logo: FC<SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <SifchainLogoSmall className={clsx("text-6xl", className)} {...props} />
);

export const LogoFull: FC<SVGProps<SVGSVGElement>> = ({
  className,
  ...props
}) => <SifchainLogo className={clsx("text-7xl", className)} {...props} />;

export const SurfaceA = tw.div`bg-gray-800 border border-gray-700 p-4 rounded-lg`;

export const SurfaceB = tw.div`bg-gray-850 border border-gray-750 p-4 rounded-lg`;
