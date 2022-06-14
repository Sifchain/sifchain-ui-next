import type { IAsset } from "@sifchain/common";
import { compose, indexBy, prop, toLower } from "rambda";
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
      return [] as IAsset[];
    }

    const filteredEntries = data?.registry?.entries
      .map((entry) => ({
        entry,
        asset:
          indexedBySymbol[entry.denom.toLowerCase()] ||
          indexedBySymbol[entry.baseDenom.toLowerCase()] ||
          indexedBySymbol[entry.denom.slice(1).toLowerCase()],
      }))
      .filter((x) => Boolean(x.asset));

    return filteredEntries.map(({ asset, entry }) => ({
      ...(asset as IAsset),
      ibcDenom: asset?.ibcDenom ?? entry.denom ?? "",
    }));
  }, [data]);

  const indices = useMemo(() => {
    if (!entries || !query.isSuccess) {
      return {
        indexedBySymbol: {},
        indexedByDisplaySymbol: {},
        indexedByIBCDenom: {},
      };
    }

    const indexedBySymbol = indexBy(compose(toLower, prop("symbol")), entries);
    const indexedByDisplaySymbol = indexBy(
      compose(toLower, prop("displaySymbol")),
      entries,
    );
    const indexedByIBCDenom = indexBy(prop("ibcDenom"), entries);

    return {
      indexedBySymbol,
      indexedByDisplaySymbol,
      indexedByIBCDenom,
    };
  }, [entries]);

  return {
    data: entries,
    ...query,
    ...indices,
    isSuccess: query.isSuccess || assetsQeuery.isSuccess,
    isLoading: query.isLoading || assetsQeuery.isLoading,
  };
}
