import { isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant, toast } from "@sifchain/ui";
import { isNil } from "rambda";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSifSigner } from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";
import { LIQUIDITY_PROVIDERS_QUERY_KEY, LIQUIDITY_PROVIDER_QUERY_KEY } from "./liquidityProvider";

const useCancelLiquidityUnlockMutation = () => {
  const queryClient = useQueryClient();
  const { signer } = useSifSigner();
  const { data: stargateClient } = useSifSigningStargateClient();

  const baseMutation = useMutation(
    async (variables: { denom: string; units: string }) => {
      invariant(signer !== undefined, "signer is undefined");
      invariant(stargateClient !== undefined, "stargateClient is undefined");

      const signerAddress = (await signer.getAccounts())[0]?.address ?? "";

      return stargateClient.signAndBroadcast(
        signerAddress,
        [
          {
            typeUrl: "/sifnode.clp.v1.MsgCancelUnlock",
            value: {
              signer: signerAddress,
              externalAsset: { symbol: variables.denom },
              units: variables.units,
            },
          },
        ],
        DEFAULT_FEE,
      );
    },
    {
      onMutate: () => {
        toast.info("Canceling unbond request inprogress");
      },
      onSettled: (data, error) => {
        queryClient.invalidateQueries([LIQUIDITY_PROVIDER_QUERY_KEY]);
        queryClient.invalidateQueries([LIQUIDITY_PROVIDERS_QUERY_KEY]);

        if (!isNil(error)) {
          if (error instanceof Error || "message" in (error as Error)) {
            toast.error((error as Error).message);
          } else {
            toast.error("Failed to cancel unbonding request");
          }
          return;
        }

        if (data === undefined) return;

        if (Boolean(error) || isDeliverTxFailure(data)) {
          toast.error(data?.rawLog ?? "Failed to cancel unbonding request");
        } else if (data !== undefined && isDeliverTxSuccess(data)) {
          toast.success("Successfully cancelled unbonding request");
        }
      },
    },
  );

  return {
    ...baseMutation,
    isReady: signer !== undefined && stargateClient !== undefined,
  };
};

export default useCancelLiquidityUnlockMutation;
