import type { IAsset, NetworkKind } from "@sifchain/common";
import type { StringIndexed } from "@sifchain/ui";
import { caseInsensitiveRecord, Maybe, memoizeWith } from "@sifchain/utils";
import { compose, identity, indexBy, prop, toLower } from "rambda";
import { useMemo } from "react";
import { useAssetsQuery } from "~/domains/assets";
import { useDexEnvironment } from "~/domains/core/envs";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";

export type EnhancedRegistryAsset = IAsset & {
  chainId: string;
  denom: string;
};

export default function useTokenRegistryQuery(networkKind: NetworkKind | NetworkKind[] = "sifchain") {
  const { data: env } = useDexEnvironment();
  const { data, ...query } = useSifnodeQuery("tokenRegistry.entries", [{}], {
    refetchOnWindowFocus: false,
    staleTime: 60000 * 5, // 5 minutes
  });

  const { indexedBySymbol, ...assetsQuery } = useAssetsQuery(networkKind);

  const entries = useMemo<EnhancedRegistryAsset[] | undefined>(() => {
    if (!data?.registry?.entries || !indexedBySymbol) {
      return undefined;
    }

    return (
      data.registry.entries
        // base token have no unitDenom
        .filter((x) => x.unitDenom === "")
        .reduce<EnhancedRegistryAsset[]>((acc, entry) => {
          const maybeAsset = (indexedBySymbol[entry.denom.toLowerCase()] ||
            indexedBySymbol[entry.baseDenom.toLowerCase()] ||
            indexedBySymbol[entry.denom.slice(1).toLowerCase()]) as EnhancedRegistryAsset | undefined;

          return Maybe.of(maybeAsset).mapOr(acc, (asset) =>
            acc.concat({
              ...asset,
              denom: entry.denom,
              chainId:
                entry.denom === env?.nativeAsset.symbol.toLowerCase() ? env.sifChainId : entry.ibcCounterpartyChainId,
            }),
          );
        }, [])
    );
  }, [data?.registry?.entries, env, indexedBySymbol]);

  const indices = useMemo(() => {
    if (!entries || !query.isSuccess) {
      return {
        indexedBySymbol: {} as StringIndexed<EnhancedRegistryAsset>,
        indexedByDisplaySymbol: {} as StringIndexed<EnhancedRegistryAsset>,
        indexedByDenom: {} as StringIndexed<EnhancedRegistryAsset>,
      };
    }

    const indexedBySymbol = caseInsensitiveRecord(indexBy(prop("symbol"), entries));
    const indexedByDisplaySymbol = caseInsensitiveRecord(indexBy(prop("displaySymbol"), entries));
    const indexedByDenom = caseInsensitiveRecord(indexBy(prop("denom"), entries));

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
