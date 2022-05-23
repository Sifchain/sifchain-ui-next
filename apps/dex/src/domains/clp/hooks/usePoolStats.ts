import { indexBy } from "rambda";
import { useMemo } from "react";

import useVanirQuery from "~/hooks/useVanirQuery";

export default function usePoolsQuery() {
  const { data, ...query } = useVanirQuery("assets.getTokenStats", []);

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
