import { Decimal } from "@cosmjs/math";
import { useQuery } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";

export function usePoolsQuery() {
  const { data: tokenRegistryRes, indexedByDenom } = useTokenRegistryQuery();
  const { data: poolsRes } = useSifnodeQuery("clp.getPools", [{}]);
  const { data: env } = useDexEnvironment();

  return useQuery(
    "pools",
    () => {
      return poolsRes === undefined
        ? undefined
        : {
            ...poolsRes,
            pools: poolsRes?.pools.map((x) => ({
              ...x,
              externalAssetBalance: Decimal.fromAtomics(
                x.externalAssetBalance,
                indexedByDenom[x.externalAsset?.symbol ?? ""]?.decimals ?? 0,
              ),
              nativeAssetBalance: Decimal.fromAtomics(
                x.nativeAssetBalance,
                env?.nativeAsset.decimals ?? 0,
              ),
            })),
          };
    },
    {
      enabled:
        tokenRegistryRes !== undefined &&
        poolsRes !== undefined &&
        env !== undefined,
    },
  );
}
