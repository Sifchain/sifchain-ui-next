import clsx from "clsx";
import type { FC } from "react";

import { AsyncImage } from "../../components";

type AssetIconProps = {
  imageUrl: string;
  hasDarkIcon?: boolean;
};

export const AssetIcon: FC<AssetIconProps> = (props) => (
  <AsyncImage
    src={props.imageUrl}
    className={clsx("relative grid h-8 w-8 place-items-center rounded-full border-4 border-black/70 bg-black p-px", {
      "!bg-white": props.hasDarkIcon,
    })}
  />
);
