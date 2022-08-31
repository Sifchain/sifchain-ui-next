import clsx from "clsx";
import type { FC } from "react";

import { AsyncImage } from "../../components";
import { AssetIcon } from "./AssetIcon";
import type { TokenEntry } from "./types";

export type TokenItemProps = Pick<
  TokenEntry,
  "name" | "symbol" | "displaySymbol" | "imageUrl" | "hasDarkIcon" | "homeNetworkUrl"
> & {
  balance?: number;
  selected: boolean;
  active: boolean;
};

export const TokenItem: FC<TokenItemProps> = (props) => {
  return (
    <div
      role="button"
      className={clsx("flex items-center gap-4 px-2 transition-colors", {
        "bg-gray-600": props.active || props.selected,
      })}
    >
      <div className="relative">
        <AssetIcon imageUrl={props.imageUrl ?? ""} hasDarkIcon={Boolean(props.hasDarkIcon)} />
        {props.homeNetworkUrl && (
          <figure className="absolute top-4 -right-2 h-5 w-5 overflow-hidden rounded-full bg-gray-800 ring-2 ring-gray-800">
            <AsyncImage
              src={props.homeNetworkUrl}
              className="origin-center scale-[1.35] object-cover grayscale invert"
            />
          </figure>
        )}
      </div>
      <div className="grid flex-1">
        <span className="text-base font-semibold uppercase text-white">{props.displaySymbol}</span>
        <span className="text-sm font-normal text-gray-300">{props.name}</span>
      </div>
      {props.balance !== undefined && (
        <div>
          <span className="text-sm font-semibold text-white">
            {props.balance.toLocaleString(undefined, {
              style: "decimal",
              maximumFractionDigits: 4,
            })}
          </span>
        </div>
      )}
    </div>
  );
};
