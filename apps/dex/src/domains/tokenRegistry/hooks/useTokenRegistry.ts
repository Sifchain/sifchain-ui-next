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

  const { indexedBySymbol, ...assetsQuery } = useAssetsQuery();

  const entries = useMemo(() => {
    if (!data?.registry?.entries || !indexedBySymbol) {
      return [] as Array<IAsset & { chainId: string; ibcDenom: string }>;
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

    return filteredEntries.map(({ asset, entry }) => {
      return {
        ...(asset as IAsset),
        chainId: entry.ibcCounterpartyChainId,
        ibcDenom: asset?.ibcDenom ?? entry.denom,
        address:
          indexedBySymbol[(asset?.ibcDenom ?? entry.denom).replace(/^c/, "")]
            ?.address ?? "",
      };
    });
  }, [data?.registry?.entries, indexedBySymbol]);

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
  }, [entries, query.isSuccess]);

  return {
    data: entries,
    ...query,
    ...indices,
    isSuccess: query.isSuccess && assetsQuery.isSuccess,
    isLoading: query.isLoading || assetsQuery.isLoading,
  };
}
