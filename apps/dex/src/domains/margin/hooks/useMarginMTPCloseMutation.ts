import { isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import type * as MarginTX from "@sifchain/proto-types/sifnode/margin/v1/tx";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant, toast } from "@sifchain/ui";
import { isError, useMutation } from "react-query";

import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";
import * as errors from "./mutationErrorMessage";

export type CloseMTPVariables = Omit<MarginTX.MsgClose, "signer">;

export function friendlyCloseMTPMutationErrorMessage(error: string) {
  if (error.includes("unauthorized")) {
    return errors.ACCOUNT_NOT_APPROVED_FOR_TRADING;
  }

  console.group("Missing Friendly Error Message for Close MTP error:");
  console.log(error);
  console.groupEnd();
  return errors.DEFAULT_ERROR_CLOSE_POSITION;
}

export function useMarginMTPCloseMutation() {
  const { data: signerAddress } = useSifSignerAddress();
  const { data: signingStargateClient } = useSifSigningStargateClient();

  async function mutation(variables: CloseMTPVariables) {
    invariant(signerAddress !== undefined, "Sif signer is not defined");
    invariant(signingStargateClient !== undefined, "Sif signing stargate client is not defined");

    return await signingStargateClient.signAndBroadcast(
      signerAddress,
      [
        {
          typeUrl: "/sifnode.margin.v1.MsgClose",
          value: {
            signer: signerAddress,
            ...variables,
          },
        },
      ],
      DEFAULT_FEE,
    );
  }

  let toastId: string | number;

  return useMutation(mutation, {
    onMutate() {
      toastId = toast.info("Closing margin position", {
        isLoading: true,
        autoClose: false,
      });
    },

    onSettled(data, error) {
      toast.dismiss(toastId);
      console.group("Close MTP Error");
      console.log(data);
      console.log(error);
      console.groupEnd();

      if (data === undefined || Boolean(error) || isDeliverTxFailure(data)) {
        const errorMessage = isError(error)
          ? friendlyCloseMTPMutationErrorMessage(error.message)
          : friendlyCloseMTPMutationErrorMessage(data && data.rawLog ? data.rawLog : "");

        toast.error(`Error: ${errorMessage}`);
      } else if (data !== undefined && isDeliverTxSuccess(data)) {
        toast.success(`Successfully closed margin position`);
      }
    },
  });
}
