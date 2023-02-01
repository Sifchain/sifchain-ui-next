import { Decimal } from "@cosmjs/math";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";

import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";

export function usePoolQuery(
  denom: string,
  options: {
    refetchInterval?: number;
    enabled?: boolean;
  } = {},
) {
  const { indexedByDenom } = useTokenRegistryQuery();
  const { data: poolRes } = useSifnodeQuery("clp.getPool", [{ symbol: denom }]);
  const { data: env } = useDexEnvironment();

  const externalToken = indexedByDenom[poolRes?.pool?.externalAsset?.symbol ?? ""];

  return useQuery(
    ["pool", denom],
    () => {
      invariant(poolRes !== undefined, "poolsRes is undefined");
      invariant(externalToken !== undefined, "externalToken is undefined");
      invariant(env !== undefined, "env is undefined");

      return {
        ...poolRes,
        pool:
          poolRes.pool === undefined
            ? undefined
            : {
                ...poolRes.pool,
                externalAssetBalance: Decimal.fromAtomics(poolRes.pool.externalAssetBalance, externalToken.decimals),
                nativeAssetBalance: Decimal.fromAtomics(poolRes.pool.nativeAssetBalance, env.nativeAsset.decimals),
              },
      };
    },
    {
      enabled: externalToken !== undefined && poolRes !== undefined && env !== undefined,
      ...options,
    },
  );
}
