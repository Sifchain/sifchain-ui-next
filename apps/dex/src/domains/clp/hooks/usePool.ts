import { Decimal } from "@cosmjs/math";
import { invariant } from "@sifchain/ui";
import { useQuery } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";

export function usePoolQuery(denom: string) {
  const { data: tokenRegistryRes, indexedByDenom } = useTokenRegistryQuery();
  const { data: poolRes } = useSifnodeQuery("clp.getPool", [{ symbol: denom }]);
  const { data: env } = useDexEnvironment();

  return useQuery(
    ["pool", denom],
    () => {
      invariant(poolRes !== undefined, "poolsRes is undefined");

      return {
        ...poolRes,
        pool:
          poolRes.pool === undefined
            ? undefined
            : {
                ...poolRes.pool,
                externalAssetBalance: Decimal.fromAtomics(
                  poolRes.pool.externalAssetBalance,
                  indexedByDenom[poolRes.pool.externalAsset?.symbol ?? ""]
                    ?.decimals ?? 0,
                ),
                nativeAssetBalance: Decimal.fromAtomics(
                  poolRes.pool.nativeAssetBalance,
                  env?.nativeAsset.decimals ?? 0,
                ),
              },
      };
    },
    {
      enabled:
        tokenRegistryRes !== undefined &&
        poolRes !== undefined &&
        env !== undefined,
    },
  );
}
