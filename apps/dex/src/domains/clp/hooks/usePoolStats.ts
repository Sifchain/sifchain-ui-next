import { useMemo } from "react";
import { useQuery } from "react-query";
import { indexBy } from "rambda";

import useVanirClient from "~/hooks/useVanirClient";

export default function usePoolsQuery() {
  const { data: client, isSuccess } = useVanirClient();
  const { data, ...query } = useQuery(
    "pool-stats",
    () => client?.getTokenStats(),
    {
      enabled: isSuccess && Boolean(client),
    },
  );

  const indexedBySymbol = useMemo(() => {
    if (!data) {
      return {};
    }

    return indexBy((x) => x.symbol, data.pools);
  }, [data?.pools]);

  return {
    ...query,
    data,
    indexedBySymbol,
  };
}
