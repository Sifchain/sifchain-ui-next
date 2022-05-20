import { useMemo } from "react";
import { indexBy, prop } from "rambda";

import useSifnodeQuery from "~/hooks/useSifnodeQuery";

export default function useTokenRegistryQuery() {
  const { data, ...query } = useSifnodeQuery("tokenRegistry.entries", [{}], {
    refetchOnWindowFocus: false,
    staleTime: 60000 * 5, // 5 minutes
  });

  const indices = useMemo(() => {
    if (!data?.registry?.entries || !query.isSuccess) {
      return {};
    }

    return {
      indexedBySymbol: indexBy(prop("denom"), data.registry?.entries),
      indexedByBaseDenom: indexBy(prop("baseDenom"), data.registry?.entries),
    };
  }, [data?.registry, query.isSuccess]);

  return { data, ...query, ...indices };
}
