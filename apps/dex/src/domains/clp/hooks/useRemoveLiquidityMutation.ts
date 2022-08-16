import { isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant, toast } from "@sifchain/ui";
import { isNil } from "rambda";
import { useMutation, useQueryClient } from "react-query";
import { useSifSigner } from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";
import {
  LIQUIDITY_PROVIDERS_QUERY_KEY,
  LIQUIDITY_PROVIDER_QUERY_KEY,
} from "./liquidityProvider";

const useRemoveLiquidityMutation = () => {
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
            typeUrl: "/sifnode.clp.v1.MsgRemoveLiquidityUnits",
            value: {
              signer: signerAddress,
              externalAsset: { symbol: variables.denom },
              withdrawUnits: variables.units,
            },
          },
        ],
        DEFAULT_FEE
      );
    },
    {
      onMutate: () => {
        toast.info("Claiming unlocked liquidity inprogress");
      },
      onSettled: (data, error) => {
        queryClient.invalidateQueries(LIQUIDITY_PROVIDER_QUERY_KEY);
        queryClient.invalidateQueries(LIQUIDITY_PROVIDERS_QUERY_KEY);

        if (!isNil(error)) {
          if (error instanceof Error || "message" in (error as Error)) {
            toast.error((error as Error).message);
          } else {
            toast.error("Failed to claim unlocked liquidity");
          }
          return;
        }

        if (data === undefined) return;

        if (Boolean(error) || isDeliverTxFailure(data)) {
          toast.error(data?.rawLog ?? "Failed to claim unlocked liquidity");
        } else if (data !== undefined && isDeliverTxSuccess(data)) {
          toast.success(`Successfully claimed unlocked liquidity`);
        }
      },
    }
  );

  return {
    ...baseMutation,
    isReady: signer !== undefined && stargateClient !== undefined,
  };
};

export default useRemoveLiquidityMutation;
