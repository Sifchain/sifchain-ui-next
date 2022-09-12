import type { NetworkKind } from "@sifchain/common";
import { caseInsensitiveRecord } from "@sifchain/utils";
import { indexBy, prop } from "rambda";
import { useMemo } from "react";

import { useDexEnvironment } from "~/domains/core/envs";

export function useAssetsQuery(networkKinds: NetworkKind | NetworkKind[] = "sifchain") {
  const { data: dexEnv, ...query } = useDexEnvironment();

  const networkAssets = useMemo(() => {
    if (!dexEnv) {
      return [];
    }

    const { assets } = dexEnv;

    if (!assets) {
      return [];
    }

    return assets.filter((x) =>
      typeof networkKinds === "string" ? x.network === networkKinds : networkKinds.includes(x.network),
    );
  }, [dexEnv, networkKinds]);

  const indices = useMemo(() => {
    if (!networkAssets) {
      return {
        indexedBySymbol: {},
        indexedByDisplaySymbol: {},
      };
    }

    const indexedBySymbol = caseInsensitiveRecord(indexBy(prop("symbol"), networkAssets));

    const indexedByDisplaySymbol = caseInsensitiveRecord(indexBy(prop("displaySymbol"), networkAssets));

    return {
      indexedBySymbol,
      indexedByDisplaySymbol,
    };
  }, [networkAssets]);

  return {
    data: {
      ...dexEnv,
      assets: networkAssets,
    },
    ...query,
    ...indices,
  };
}
