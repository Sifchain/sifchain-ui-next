import { Maybe } from "@sifchain/ui";
import { indexBy } from "rambda";
import { useMemo } from "react";

import useSifApiQuery from "~/hooks/useSifApiQuery";

export function usePoolStatsQuery() {
  const { data, ...query } = useSifApiQuery("assets.getTokenStats", []);

  const indexedBySymbol = useMemo(() => {
    return Maybe.of(data?.pools).mapOr(
      {},
      indexBy((x) => x.symbol?.toLowerCase()),
    );
  }, [data?.pools]);

  return {
    ...query,
    data,
    indexedBySymbol,
  };
}
