import { AsyncImage, RacetrackSpinnerIcon, Tooltip } from "@sifchain/ui";
import clsx from "clsx";
import { type FC, useMemo, useState, forwardRef, memo } from "react";
import SVG, { Props as SVGProps } from "react-inlinesvg";

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

const NOTFOUND = new Set<string>();

const AssetIcon: FC<Props> = (props) => {
  const {
    isLoading: isLoadingAsset,
    indexedBySymbol,
    indexedByDisplaySymbol,
  } = useAssetsQuery();

  const asset = useMemo(
    () =>
      indexedBySymbol[props.symbol.toLowerCase()] ||
      indexedBySymbol[props.symbol.slice(1).toLowerCase()] ||
      indexedByDisplaySymbol[props.symbol.toLowerCase()],
    [indexedByDisplaySymbol, indexedBySymbol, props.symbol],
  );

  if (!asset) {
    console.log(`AssetIcon: asset not found for ${props.symbol}`);
  }

  const placeholder = useMemo(
    () => (
      <RacetrackSpinnerIcon
        className={(clsx(CLASS_MAP[props.size]), "absolute z-0")}
      />
    ),
    [props.size],
  );
  return (
    <Tooltip content={asset ? `${asset.name}` : "Loading..."}>
      <figure
        className={clsx(
          "ring ring-slate-900 rounded-full bg-cover overflow-hidden relative grid place-items-center",
          CLASS_MAP[props.size],
          {
            invert: Boolean(props.invertColor),
          },
        )}
      >
        {isLoadingAsset ? (
          placeholder
        ) : (
          <AsyncImage
            src={asset?.imageUrl ?? ""}
            placeholder={placeholder}
            className="z-10"
          />
        )}
      </figure>
    </Tooltip>
  );
};

AssetIcon.defaultProps = {
  size: "md",
  showNetwork: false,
};

export default memo(AssetIcon);
