import { Tooltip } from "@sifchain/ui";
import clsx from "clsx";
import React, { type FC, useMemo } from "react";
import { useAssetsQuery } from "~/domains/assets";

type Props = {
  network: "ethereum" | "sifchain" | "cosmoshub";
  symbol: string;
  size: "xs" | "sm" | "md" | "lg" | "xl";
  invertColor?: boolean | undefined;
  showNetwork?: boolean | undefined;
};

const CLASS_MAP: Record<Props["size"], string> = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
};

const AssetIcon: FC<Props> = (props) => {
  const { isLoading, indexedBySymbol, indexedByDisplaySymbol } =
    useAssetsQuery();

  const asset = useMemo(
    () =>
      indexedBySymbol[props.symbol.toLowerCase()] ||
      indexedBySymbol[props.symbol.slice(1).toLowerCase()] ||
      indexedByDisplaySymbol[props.symbol.toLowerCase()],
    [],
  );

  if (!asset) {
    console.log(`AssetIcon: asset not found for ${props.symbol}`);
  }

  return (
    <Tooltip content={asset ? `${asset.name}` : "Loading..."}>
      <div className="relative">
        <figure
          className={clsx(
            "ring ring-slate-900 rounded-full p-2 bg-cover overflow-hidden",
            CLASS_MAP[props.size],
            {
              invert: props.invertColor,
            },
          )}
          style={{
            backgroundImage: `url(${asset?.imageUrl})`,
          }}
        >
          {isLoading ? "..." : ""}
        </figure>
      </div>
    </Tooltip>
  );
};

AssetIcon.defaultProps = {
  size: "md",
  showNetwork: false,
};

export default AssetIcon;
