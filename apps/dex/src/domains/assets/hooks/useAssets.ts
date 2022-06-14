import { compose, prop, toLower } from "rambda";
import { indexBy } from "ramda";
import { useMemo } from "react";

import { useDexEnvironment } from "~/domains/core/envs";

export function useAssetsQuery() {
  const { data, ...query } = useDexEnvironment();

  const indices = useMemo(() => {
    if (!data || !query.isSuccess) {
      return {
        indexedBySymbol: {},
        indexedByDisplaySymbol: {},
      };
    }

    const indexedBySymbol = indexBy(
      compose(toLower, prop("symbol")),
      data.assets,
    );

    const indexedByDisplaySymbol = indexBy(
      compose(toLower, prop("displaySymbol")),
      data.assets,
    );

    return {
      indexedBySymbol,
      indexedByDisplaySymbol,
    };
  }, [data?.assets]);

  return {
    data: {
      ...data,
      assets: data?.assets.map((asset) => ({
        ...asset,
        symbol: asset.symbol.toLowerCase(),
        displaySymbol: asset.displaySymbol.toLowerCase(),
      })),
    },
    ...query,
    ...indices,
  };
}
