import { useMemo } from "react";
import { indexBy } from "rambda";

import useSifnodeQuery from "~/hooks/useSifnodeQuery";

export default function usePoolsQuery() {
  const { data, ...query } = useSifnodeQuery("clp.getPools", [{}]);

  const indexedByExternalSymbol = useMemo(() => {
    if (!data?.pools) {
      return {};
    }

    return indexBy(({ externalAsset }) => externalAsset?.symbol, data.pools);
  }, [data?.pools]);

  return {
    ...query,
    data,
    indexedByExternalSymbol,
  };
}
