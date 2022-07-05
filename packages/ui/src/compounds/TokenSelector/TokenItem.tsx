import clsx from "clsx";
import type { FC } from "react";

import { AssetIcon } from "./AssetIcon";
import type { TokenEntry } from "./types";

export type TokenItemProps = Pick<
  TokenEntry,
  "name" | "symbol" | "displaySymbol" | "imageUrl" | "hasDarkIcon"
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
      <AssetIcon
        imageUrl={props.imageUrl ?? ""}
        hasDarkIcon={Boolean(props.hasDarkIcon)}
      />
      <div className="grid flex-1">
        <span className="text-white text-base font-semibold uppercase">
          {props.displaySymbol}
        </span>
        <span className="text-gray-300 text-sm font-normal">{props.name}</span>
      </div>
      <div>
        {Boolean(props.balance) && (
          <span className="text-white font-semibold text-sm">
            {props.balance}
          </span>
        )}
      </div>
    </div>
  );
};
