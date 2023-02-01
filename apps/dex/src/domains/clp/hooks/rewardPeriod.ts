import { addMilliseconds } from "date-fns";
import invariant from "tiny-invariant";

import { useQuery } from "@tanstack/react-query";
import { useBlockTimeQuery } from "~/hooks/useBlockTime";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import { useSifStargateClient } from "~/hooks/useSifStargateClient";

export const useCurrentRewardPeriodQuery = () => {
  const { data: stargateClient } = useSifStargateClient();
  const { data: rewardParamsRes } = useSifnodeQuery("clp.getRewardParams", [{}]);
  const { data: blockTime } = useBlockTimeQuery();

  return useQuery(
    ["currentRewardPeriod"],
    async () => {
      invariant(stargateClient !== undefined, "stargateClient is undefined");
      invariant(rewardParamsRes !== undefined, "rewardParamsRes is undefined");
      invariant(blockTime !== undefined, "blockTime is undefined");

      const currentHeight = await stargateClient.getHeight();

      const currentRewardPeriod = rewardParamsRes.params?.rewardPeriods.find((x) => {
        const startBlock = x.rewardPeriodStartBlock.toNumber();
        const endBlock = x.rewardPeriodEndBlock.toNumber();

        return startBlock <= currentHeight && currentHeight < endBlock;
      });

      if (currentRewardPeriod === undefined) {
        return;
      }

      const blocksRemainingTilInactive = currentRewardPeriod.rewardPeriodEndBlock.toNumber() - currentHeight;
      const estimatedRewardPeriodEndDate = addMilliseconds(new Date(), blocksRemainingTilInactive * blockTime);

      return { ...currentRewardPeriod, estimatedRewardPeriodEndDate };
    },
    {
      enabled: stargateClient !== undefined && rewardParamsRes !== undefined && blockTime !== undefined,
    },
  );
};
