import type { IAsset } from "@sifchain/common";
import { indexBy, prop } from "rambda";
import { useMemo } from "react";

import { useAssetsQuery } from "~/domains/assets";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";

export default function useTokenRegistryQuery() {
  const { data, ...query } = useSifnodeQuery("tokenRegistry.entries", [{}], {
    refetchOnWindowFocus: false,
    staleTime: 60000 * 5, // 5 minutes
  });

  const { indexedBySymbol, ...assetsQeuery } = useAssetsQuery();

  const entries = useMemo(() => {
    if (!data?.registry?.entries || !indexedBySymbol) {
      return [];
    }

    const filteredEntries = data?.registry?.entries
      .map(
        (entry) =>
          indexedBySymbol[entry.denom] ||
          indexedBySymbol[entry.baseDenom] ||
          indexedBySymbol[entry.baseDenom.replace(/^[ucx]/i, "")],
      )
      .filter(Boolean);

    return filteredEntries as IAsset[];
  }, [data]);

  const indices = useMemo(() => {
    if (!entries || !query.isSuccess) {
      return {
        indexedBySymbol: {},
        indexedByDisplaySymbol: {},
      };
    }

    return {
      indexedBySymbol: indexBy(prop("symbol"), entries),
      indexedByDisplaySymbol: indexBy(prop("displaySymbol"), entries),
    };
  }, [entries, query.isSuccess]);

  return {
    data: entries,
    ...query,
    ...indices,
    isSuccess: query.isSuccess || assetsQeuery.isSuccess,
    isLoading: query.isLoading || assetsQeuery.isLoading,
  };
}
