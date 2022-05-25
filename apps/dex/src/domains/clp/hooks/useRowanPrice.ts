import { useMemo } from "react";
import usePoolStatsQuery from "./usePoolStats";

export default function useRowanPriceQuery() {
  const { data: poolStats, ...poolStatsQuery } = usePoolStatsQuery();

  const rowanPrice = useMemo(
    () => Number(poolStats?.rowanUSD),
    [poolStats?.rowanUSD],
  );

  return {
    ...poolStatsQuery,
    data: rowanPrice,
  };
}
