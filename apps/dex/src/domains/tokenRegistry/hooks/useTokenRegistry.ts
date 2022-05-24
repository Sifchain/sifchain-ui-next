import { useMemo } from "react";
import { indexBy, prop } from "rambda";

import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import useAssets from "~/domains/assets/hooks/useAssets";

export default function useTokenRegistryQuery() {
  const { data, ...query } = useSifnodeQuery("tokenRegistry.entries", [{}], {
    refetchOnWindowFocus: false,
    staleTime: 60000 * 5, // 5 minutes
  });

  const assets = useAssets("mainnet");

  const entries = useMemo(() => {
    if (!data?.registry?.entries) {
      return [];
    }

    const indexedBySymbol = indexBy(prop("symbol"), assets);
    const indexedByIBCDenom = indexBy(prop("ibcDenom"), assets);

    const filteredEntries = data?.registry?.entries
      .map(
        (entry) =>
          indexedBySymbol[entry.denom] ?? indexedByIBCDenom[entry.baseDenom],
      )
      .filter(Boolean);

    return filteredEntries;
  }, [data]);

  const indices = useMemo(() => {
    if (!entries || !query.isSuccess) {
      return {
        indexedBySymbol: {},
        indexedByDisplaySymbol: {},
        indexedIBCDenom: {},
      };
    }

    return {
      indexedBySymbol: indexBy(prop("symbol"), entries),
      indexedByDisplaySymbol: indexBy(prop("displaySymbol"), entries),
      indexedIBCDenom: indexBy(prop("ibcDenom"), entries),
    };
  }, [entries, query.isSuccess]);

  return { data: entries, ...query, ...indices };
}
