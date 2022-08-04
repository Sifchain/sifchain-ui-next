import clsx from "clsx";
import type { FC } from "react";

import { AsyncImage } from "../../components";
import { AssetIcon } from "./AssetIcon";
import type { TokenEntry } from "./types";

export type TokenItemProps = Pick<
  TokenEntry,
  | "name"
  | "symbol"
  | "displaySymbol"
  | "imageUrl"
  | "hasDarkIcon"
  | "homeNetworkUrl"
> & {
  balance: string;
  selected: boolean;
  active: boolean;
};

export const TokenItem: FC<TokenItemProps> = (props) => {
  return (
    <div
      role="button"
      className={clsx("flex items-center py-1 px-8 gap-4 transition-colors", {
        "bg-gray-600": props.active || props.selected,
      })}
    >
      <div className="relative">
        <AssetIcon
          imageUrl={props.imageUrl ?? ""}
          hasDarkIcon={Boolean(props.hasDarkIcon)}
        />
        {props.homeNetworkUrl && (
          <figure className="h-5 w-5 absolute top-4 ring-2 ring-gray-800 -right-2 rounded-full overflow-hidden bg-gray-800">
            <AsyncImage
              src={props.homeNetworkUrl}
              className="object-cover origin-center scale-[1.35] grayscale invert"
            />
          </figure>
        )}
      </div>
      <div className="grid flex-1">
        <span className="text-white text-base font-semibold uppercase">
          {props.displaySymbol}
        </span>
        <span className="text-gray-300 text-sm font-normal">{props.name}</span>
      </div>
      {Boolean(props.balance) && (
        <div>
          <span className="text-white font-semibold text-sm">
            {props.balance}
          </span>
        </div>
      )}
    </div>
  );
};
