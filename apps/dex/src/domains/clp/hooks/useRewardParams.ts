import { Decimal } from "@cosmjs/math";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";

import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";

export function useRewardParams(
  options: {
    refetchInterval?: number;
    enabled?: boolean;
  } = {},
) {
  const { data: paramsRes } = useSifnodeQuery("clp.getRewardParams", [{}]);
  const { data: env } = useDexEnvironment();


  return useQuery(
    ["rewardParams"],
    () => {
      invariant(paramsRes !== undefined, "paramsRes is undefined");
      invariant(env !== undefined, "env is undefined");

      return {
        ...paramsRes,
      };
    },
    {
      enabled: paramsRes !== undefined && env !== undefined,
      ...options,
    },
  );
}
