import { caseInsensitiveRecord, Maybe } from "@sifchain/utils";
import { compose, indexBy } from "rambda";
import { useMemo } from "react";

import useSifApiQuery from "~/hooks/useSifApiQuery";

export function usePoolStatsQuery() {
  // TODO: must be reverted to "assets.getTokenStats" when deployed to mainnet
  const { data, ...query } = useSifApiQuery("assets.getTokenStatsPMTP", [], {
    retry: false,
  });

  const indexedBySymbol = useMemo(() => {
    return Maybe.of(data?.pools).mapOr(
      {},
      compose(
        caseInsensitiveRecord,
        indexBy((x) => x.symbol?.toLowerCase()),
      ),
    );
  }, [data?.pools]);

  return {
    ...query,
    data,
    indexedBySymbol,
    findBySymbolOrDenom: (symbolOrDenom: string) => {
      return indexedBySymbol[symbolOrDenom.toLowerCase()];
    },
  };
}
