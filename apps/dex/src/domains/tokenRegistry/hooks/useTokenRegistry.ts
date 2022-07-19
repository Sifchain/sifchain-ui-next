import type { IAsset, NetworkKind } from "@sifchain/common";
import type { StringIndexed } from "@sifchain/ui";

import { compose, identity, indexBy, prop, toLower } from "rambda";
import { memoizeWith } from "ramda";
import { useMemo } from "react";

import { useAssetsQuery } from "~/domains/assets";
import { useDexEnvironment } from "~/domains/core/envs";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";

export type EnhancedRegitryAsset = IAsset & {
  chainId: string;
  denom: string;
};

export default function useTokenRegistryQuery(
  networkKind: NetworkKind | NetworkKind[] = "sifchain",
) {
  const { data: env } = useDexEnvironment();
  const { data, ...query } = useSifnodeQuery("tokenRegistry.entries", [{}], {
    refetchOnWindowFocus: false,
    staleTime: 60000 * 5, // 5 minutes
  });

  const { indexedBySymbol, ...assetsQuery } = useAssetsQuery(networkKind);

  const entries = useMemo<EnhancedRegitryAsset[]>(() => {
    if (!data?.registry?.entries || !indexedBySymbol) {
      return [] as Array<EnhancedRegitryAsset>;
    }

    const { enhancedAssets } = data.registry.entries.reduce(
      (acc, entry) => {
        const asset = (indexedBySymbol[entry.denom.toLowerCase()] ||
          indexedBySymbol[entry.baseDenom.toLowerCase()] ||
          indexedBySymbol[
            entry.denom.slice(1).toLowerCase()
          ]) as EnhancedRegitryAsset;

        if (asset && acc.symbols.indexOf(asset.symbol) === -1) {
          acc.symbols.push(asset.symbol);

          const chainId =
            env !== undefined &&
            entry.denom === env.nativeAsset.symbol.toLowerCase()
              ? env?.sifChainId
              : entry.ibcCounterpartyChainId;

          const address = assetsQuery.data?.assets
            ?.filter((x) => x.address !== undefined)
            .find((x) => x.symbol === entry.denom.replace(/^c/, ""))?.address;

          asset.chainId = chainId;
          asset.denom = entry.denom;
          asset.address = address;
          acc.enhancedAssets.push(asset);
        }

        return acc;
      },
      {
        symbols: [],
        enhancedAssets: [],
      } as {
        symbols: string[];
        enhancedAssets: EnhancedRegitryAsset[];
      },
    );

    return enhancedAssets;
  }, [assetsQuery.data?.assets, data?.registry?.entries, env, indexedBySymbol]);

  const indices = useMemo(() => {
    if (!entries || !query.isSuccess) {
      return {
        indexedBySymbol: {} as StringIndexed<EnhancedRegitryAsset>,
        indexedByDisplaySymbol: {} as StringIndexed<EnhancedRegitryAsset>,
        indexedByDenom: {} as StringIndexed<EnhancedRegitryAsset>,
      };
    }

    const indexedBySymbol = indexBy(compose(toLower, prop("symbol")), entries);
    const indexedByDisplaySymbol = indexBy(
      compose(toLower, prop("displaySymbol")),
      entries,
    );
    const indexedByDenom = indexBy(prop("denom"), entries);

    return {
      indexedBySymbol,
      indexedByDisplaySymbol,
      indexedByDenom,
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
        indices.indexedByDenom[sanitized] ??
        indices.indexedBySymbol[sanitized] ??
        indices.indexedByDisplaySymbol[sanitized]
      );
    }),
  };
}
