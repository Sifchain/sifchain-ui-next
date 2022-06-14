import { prop } from "rambda";
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

    return {
      indexedBySymbol: indexBy(prop("symbol"), data.assets),
      indexedByDisplaySymbol: indexBy(prop("displaySymbol"), data.assets),
    };
  }, [data?.assets]);

  return { data, ...query, ...indices };
}
