import type { IAsset } from "@sifchain/common";
import type { StringIndexed } from "@sifchain/ui";
import { compose, identity, indexBy, prop, toLower } from "rambda";
import { memoizeWith } from "ramda";
import { useMemo } from "react";

import { useAssetsQuery } from "~/domains/assets";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";

export type EnhancedRegitryAsset = IAsset & {
  chainId: string;
  ibcDenom: string;
};

export default function useTokenRegistryQuery() {
  const { data, ...query } = useSifnodeQuery("tokenRegistry.entries", [{}], {
    refetchOnWindowFocus: false,
    staleTime: 60000 * 5, // 5 minutes
  });

  const { indexedBySymbol, ...assetsQuery } = useAssetsQuery();

  const entries = useMemo<EnhancedRegitryAsset[]>(() => {
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

    return filteredEntries.map(({ asset, entry }) => ({
      ...(asset as IAsset),
      chainId: entry.ibcCounterpartyChainId,
      ibcDenom: entry.denom,
      address: assetsQuery.data?.assets
        ?.filter((x) => x.address !== undefined)
        .find((x) => x.symbol === entry.denom.replace(/^c/, ""))?.address,
    }));
  }, [assetsQuery.data?.assets, data?.registry?.entries, indexedBySymbol]);

  const indices = useMemo(() => {
    if (!entries || !query.isSuccess) {
      return {
        indexedBySymbol: {} as StringIndexed<EnhancedRegitryAsset>,
        indexedByDisplaySymbol: {} as StringIndexed<EnhancedRegitryAsset>,
        indexedByIBCDenom: {} as StringIndexed<EnhancedRegitryAsset>,
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
    findBySymbolOrDenom: memoizeWith(identity, (symbolOrDenom: string) => {
      const sanitized = symbolOrDenom.toLowerCase();
      return (
        indices.indexedByIBCDenom[sanitized] ??
        indices.indexedBySymbol[sanitized] ??
        indices.indexedByDisplaySymbol[sanitized]
      );
    }),
  };
}
