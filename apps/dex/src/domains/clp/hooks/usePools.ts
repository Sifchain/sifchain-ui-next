import { useMemo } from "react";
import { useQuery } from "react-query";
import { indexBy } from "rambda";

import useQueryClient from "~/hooks/useQueryClient";

export default function usePoolsQuery() {
  const { data: client, isSuccess } = useQueryClient();
  const { data, ...query } = useQuery("pools", () => client?.clp.getPools({}), {
    enabled: isSuccess,
  });

  const indexedByExternalSymbol = useMemo(() => {
    if (!data) return {};
    return indexBy(({ externalAsset }) => externalAsset?.symbol, data.pools);
  }, [data]);

  return {
    ...query,
    data,
    indexedByExternalSymbol,
  };
}
