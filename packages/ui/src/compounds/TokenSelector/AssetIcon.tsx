import clsx from "clsx";
import type { FC } from "react";

import { AsyncImage } from "../../components";

type AssetIconProps = {
  imageUrl: string;
  hasDarkIcon?: boolean;
};

export const AssetIcon: FC<AssetIconProps> = (props) => (
  <figure
    className={clsx(
      "h-7 w-7 rounded-full grid place-items-center overflow-hidden bg-black ring-4 ring-black/60",
      {
        "!bg-white": props.hasDarkIcon,
      },
    )}
  >
    <AsyncImage src={props.imageUrl} />
  </figure>
);
