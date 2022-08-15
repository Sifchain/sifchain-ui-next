import { AsyncImage, RacetrackSpinnerIcon, Tooltip } from "@sifchain/ui";
import clsx from "clsx";
import { type FC, useMemo, memo } from "react";

import { useTokenRegistryQuery } from "~/domains/tokenRegistry";

type Props = {
  network?: "ethereum" | "sifchain" | "cosmoshub";
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

const AssetIcon: FC<Props> = memo((props) => {
  const {
    isLoading: isLoadingAsset,
    indexedBySymbol,
    indexedByDisplaySymbol,
    indexedByDenom,
  } = useTokenRegistryQuery();

  const asset = useMemo(
    () =>
      indexedByDenom[props.symbol] ||
      indexedBySymbol[props.symbol.toLowerCase()] ||
      indexedBySymbol[props.symbol.slice(1).toLowerCase()] ||
      indexedByDisplaySymbol[props.symbol.toLowerCase()],
    [indexedByDisplaySymbol, indexedByDenom, indexedBySymbol, props.symbol]
  );

  if (!asset) {
    console.log(`AssetIcon: asset not found for ${props.symbol}`);
  }

  const placeholder = useMemo(
    () => (
      <RacetrackSpinnerIcon
        className={
          (clsx(CLASS_MAP[props.size]), "h-full w-full place-self-center")
        }
      />
    ),
    [props.size]
  );

  return (
    <Tooltip content={asset ? `${asset.name}` : "Loading..."}>
      <figure
        className={clsx(
          "shadow-xs relative grid place-items-center overflow-hidden rounded-full bg-black bg-contain bg-center shadow-black ring ring-gray-900",
          CLASS_MAP[props.size],
          {
            "!bg-white": asset?.hasDarkIcon,
          }
        )}
      >
        {isLoadingAsset ? (
          placeholder
        ) : (
          <AsyncImage
            src={asset?.imageUrl ?? ""}
            placeholder={placeholder}
            className="absolute inset-0 z-10 h-full w-full"
          />
        )}
      </figure>
    </Tooltip>
  );
});

AssetIcon.displayName = "AssetIcon";

AssetIcon.defaultProps = {
  size: "md",
  showNetwork: false,
};

export default AssetIcon;
