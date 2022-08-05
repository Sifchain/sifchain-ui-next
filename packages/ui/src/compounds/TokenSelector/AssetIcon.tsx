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
    className={clsx(
      "relative h-8 p-px w-8 rounded-full grid place-items-center bg-black border-4 border-black/70",
      {
        "!bg-white": props.hasDarkIcon,
      },
    )}
  />
);
