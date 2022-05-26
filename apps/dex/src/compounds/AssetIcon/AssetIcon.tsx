import { Tooltip } from "@sifchain/ui";
import clsx from "clsx";
import React, { type FC, useMemo } from "react";
import useAssetsQuery from "~/domains/assets/hooks/useAssets";

type Props = {
  network: "ethereum" | "sifchain";
  symbol: string;
  size: "xs" | "sm" | "md" | "lg" | "xl";
  invertColor?: boolean | undefined;
};

const AssetIcon: FC<Props> = (props) => {
  const { isLoading, indexedBySymbol, indexedByDisplaySymbol } = useAssetsQuery(
    props.network,
  );

  const asset = useMemo(
    () => indexedBySymbol[props.symbol] || indexedByDisplaySymbol[props.symbol],
    [],
  );

  const classMap: Record<Props["size"], string> = {
    xs: "h-4 w-4",
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  };

  return (
    <Tooltip content={asset ? `${asset.name}` : "Loading..."}>
      <figure
        className={clsx(
          "ring ring-slate-900 rounded-full p-2 bg-cover overflow-hidden",
          classMap[props.size],
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
    </Tooltip>
  );
};

AssetIcon.defaultProps = {
  size: "md",
};

export default AssetIcon;
