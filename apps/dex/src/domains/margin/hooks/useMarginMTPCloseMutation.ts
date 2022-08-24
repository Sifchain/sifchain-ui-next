import { isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import type * as MarginTX from "@sifchain/proto-types/sifnode/margin/v1/tx";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant, toast } from "@sifchain/ui";
import { isError, useMutation } from "react-query";

import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";
import * as errors from "./mutationErrorMessage";

export type CloseMTPVariables = Omit<MarginTX.MsgClose, "signer">;

export function useMarginMTPCloseMutation() {
  const { data: signerAddress } = useSifSignerAddress();
  const { data: signingStargateClient } = useSifSigningStargateClient();

  async function mutation(variables: CloseMTPVariables) {
    invariant(signerAddress !== undefined, "Sif signer is not defined");
    invariant(signingStargateClient !== undefined, "Sif signing stargate client is not defined");

    const res = await signingStargateClient.signAndBroadcast(
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

    if (res && isDeliverTxFailure(res) && res.rawLog) {
      console.group("Close MTP Error");
      console.log({ error: res });
      console.groupEnd();

      if (
        res.rawLog.includes("unauthorized") ||
        res.rawLog.includes("unauthorised") ||
        res.rawLog.includes("address not on whitelist")
      ) {
        throw new Error(errors.ACCOUNT_NOT_APPROVED_FOR_TRADING);
      }

      if (res.rawLog.includes("mtp not found")) {
        throw new Error(errors.MTP_NOT_FOUND);
      }

      throw new Error(errors.DEFAULT_ERROR_CLOSE_POSITION);
    }

    return res;
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
      if (data === undefined && Boolean(error)) {
        const { message } = error as Error;
        toast.error(message);
      } else if (data !== undefined && isDeliverTxSuccess(data)) {
        toast.success(`Successfully closed margin position`);
      }
    },
  });
}
