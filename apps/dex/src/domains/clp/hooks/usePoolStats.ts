import { indexBy } from "rambda";
import { useMemo } from "react";

import useSifApiQuery from "~/hooks/useSifApiQuery";

export function usePoolStatsQuery() {
  const { data, ...query } = useSifApiQuery("assets.getTokenStats", []);

  const indexedBySymbol = useMemo(() => {
    if (!data?.pools) {
      return {};
    }

    return indexBy((x) => x.symbol?.toLowerCase(), data.pools);
  }, [data?.pools]);

  return {
    ...query,
    data,
    indexedBySymbol,
  };
}
