import {
  AsyncImage,
  RacetrackSpinnerIcon,
  Tooltip,
  useIntersectionObserver,
} from "@sifchain/ui";
import clsx from "clsx";
import { type FC, useMemo, memo, useRef, useEffect } from "react";

import { useAssetsQuery } from "~/domains/assets";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";

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

const AssetIcon: FC<Props> = memo((props) => {
  const {
    isLoading: isLoadingAsset,
    indexedBySymbol,
    indexedByDisplaySymbol,
    indexedByIBCDenom,
  } = useTokenRegistryQuery();

  const asset = useMemo(
    () =>
      indexedByIBCDenom[props.symbol] ||
      indexedBySymbol[props.symbol.toLowerCase()] ||
      indexedBySymbol[props.symbol.slice(1).toLowerCase()] ||
      indexedByDisplaySymbol[props.symbol.toLowerCase()],
    [indexedByDisplaySymbol, indexedByIBCDenom, indexedBySymbol, props.symbol],
  );

  if (!asset) {
    console.log(`AssetIcon: asset not found for ${props.symbol}`);
  }

  const placeholder = useMemo(
    () => (
      <RacetrackSpinnerIcon
        className={(clsx(CLASS_MAP[props.size]), "absolute inset-0")}
      />
    ),
    [props.size],
  );

  const figureRef = useRef<HTMLDivElement>(null);

  const entry = useIntersectionObserver(figureRef, {});

  useEffect(() => {
    if (entry?.isIntersecting) {
      console.log(`AssetIcon: ${props.symbol} is visible`);
    }
  }, [entry]);

  return (
    <Tooltip content={asset ? `${asset.name}` : "Loading..."}>
      <figure
        ref={figureRef}
        className={clsx(
          "relative rounded-full bg-contain overflow-hidden bg-black bg-center shadow-xs shadow-black",
          CLASS_MAP[props.size],
          {
            "!bg-white": asset?.hasDarkIcon,
          },
        )}
      >
        {isLoadingAsset ? (
          placeholder
        ) : (
          <AsyncImage
            src={asset?.imageUrl ?? ""}
            placeholder={placeholder}
            className="z-10 absolute inset-0"
          />
        )}
      </figure>
    </Tooltip>
  );
});

AssetIcon.defaultProps = {
  size: "md",
  showNetwork: false,
};

export default AssetIcon;
