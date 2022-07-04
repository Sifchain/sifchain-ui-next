import { Coin, isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import { isEvmBridgedCoin } from "@sifchain/common";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { toast } from "@sifchain/ui";
import { addMinutes, getUnixTime } from "date-fns";
import { useMutation } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";

export const useExportTokensMutation = () => {
  const { refetch: refetchStargateClient } = useSifSigningStargateClient();
  const { refetch: refetchEnv } = useDexEnvironment();

  return useMutation(
    async (variables: {
      senderAddress: string;
      recipientAddress: string;
      amount: Coin;
      memo?: string;
    }) => {
      const { data: stargateClient } = await refetchStargateClient();
      const { data: env } = await refetchEnv();

      return isEvmBridgedCoin(variables.amount)
        ? stargateClient?.sendTokensToEth(
            variables.senderAddress,
            variables.recipientAddress,
            variables.amount,
            env?.chainConfigsByNetwork.ethereum.chainId,
            undefined,
            DEFAULT_FEE,
            variables.memo,
          )
        : stargateClient?.exportIbcTokens(
            variables.senderAddress,
            variables.recipientAddress,
            variables.amount,
            "transfer",
            undefined,
            getUnixTime(addMinutes(new Date(), 15)),
            DEFAULT_FEE,
            variables.memo,
          );
    },
    {
      onMutate: () => {
        toast.info("Export inprogress");
      },
      onSettled: (data, error) => {
        if (data === undefined || Boolean(error) || isDeliverTxFailure(data)) {
          toast.error(
            data?.rawLog ?? (data as any)?.message ?? "Failed to export",
          );
        } else if (data !== undefined && isDeliverTxSuccess(data)) {
          toast.success(`Successfully exported`);
        }
      },
    },
  );
};
