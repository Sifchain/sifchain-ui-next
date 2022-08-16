import { Maybe } from "@sifchain/ui";
import { useMemo } from "react";
import { usePoolStatsQuery } from "./usePoolStats";

export function useRowanPriceQuery() {
  const { data: poolStats, ...poolStatsQuery } = usePoolStatsQuery();

  const rowanPrice = useMemo(
    () => Maybe.of(poolStats?.rowanUSD).mapOr(0, Number),
    [poolStats?.rowanUSD]
  );

  return {
    ...poolStatsQuery,
    data: rowanPrice,
  };
}
