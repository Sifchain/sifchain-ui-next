import { useMemo } from "react";
import usePoolStatsQuery from "./usePoolStats";

export default function useTVLQuery() {
  const { data: poolStats, ...poolStatsQuery } = usePoolStatsQuery();

  const tvl = useMemo(
    () => (poolStats?.pools ?? []).reduce((a, b) => a + Number(b.poolTVL), 0),
    [poolStats],
  );

  return {
    ...poolStatsQuery,
    data: tvl,
  };
}
