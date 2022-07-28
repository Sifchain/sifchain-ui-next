import { Maybe } from "@sifchain/ui";
import { compose, map, propOr, sum } from "rambda";
import { useMemo } from "react";
import { usePoolStatsQuery } from "./usePoolStats";

export function useTVLQuery() {
  const { data: poolStats, ...poolStatsQuery } = usePoolStatsQuery();

  const tvl = useMemo(
    () =>
      Maybe.of(poolStats?.pools).mapOr(
        0,
        compose(sum, map(propOr(0, "poolTVL"))),
      ),
    [poolStats],
  );

  return {
    ...poolStatsQuery,
    data: tvl,
  };
}
