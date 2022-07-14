import { propOr, sum } from "rambda";
import { useMemo } from "react";
import { usePoolStatsQuery } from "./usePoolStats";

export function useTVLQuery() {
  const { data: poolStats, ...poolStatsQuery } = usePoolStatsQuery();

  const tvl = useMemo(
    () => sum((poolStats?.pools ?? []).map(propOr(0, "poolTVL"))),
    [poolStats],
  );

  return {
    ...poolStatsQuery,
    data: tvl,
  };
}
