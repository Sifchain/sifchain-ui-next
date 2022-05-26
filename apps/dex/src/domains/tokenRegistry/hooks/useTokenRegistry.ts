import { useMemo } from "react";
import { indexBy, prop } from "rambda";

import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import useAssetsQuery from "~/domains/assets/hooks/useAssets";
import type { IAsset } from "@sifchain/core";

export default function useTokenRegistryQuery() {
  const { data, ...query } = useSifnodeQuery("tokenRegistry.entries", [{}], {
    refetchOnWindowFocus: false,
    staleTime: 60000 * 5, // 5 minutes
  });

  const { indexedBySymbol, ...assetsQeuery } = useAssetsQuery("sifchain");

  const entries = useMemo(() => {
    if (!data?.registry?.entries || !indexedBySymbol) {
      return [];
    }

    const filteredEntries = data?.registry?.entries
      .map((entry) => indexedBySymbol[entry.denom])
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
