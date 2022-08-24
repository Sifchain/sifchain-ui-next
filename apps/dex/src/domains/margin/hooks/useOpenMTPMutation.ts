import { isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import type * as MarginTX from "@sifchain/proto-types/sifnode/margin/v1/tx";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant, toast } from "@sifchain/ui";
import { isError, useMutation } from "react-query";

import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";
import * as errors from "./mutationErrorMessage";

export type OpenMTPVariables = Omit<MarginTX.MsgOpen, "signer">;

export function friendlyOpenMTPMutationErrorMessage(error: string) {
  if (error.includes("unauthorized") || error.includes("address not on whitelist")) {
    return errors.ACCOUNT_NOT_APPROVED_FOR_TRADING;
  }

  if (error.includes("margin not enabled for pool")) {
    return errors.POOL_TRADE_TEMPORARILY_DISABLED;
  }

  if (error.includes("max open positions reached")) {
    return errors.POOL_MAX_OPEN_POSITIONS_REACHED;
  }

  if (error.includes("user does not have enough balance of the required coin")) {
    return errors.ACCOUNT_NOT_ENOUGH_BALANCE;
  }

  if (error.includes("Account does not exist on chain")) {
    return errors.ACCOUNT_NOT_IN_SIFCHAIN;
  }

  console.group("Missing Friendly Error Message for Open MTP error:");
  console.log(error);
  console.groupEnd();
  return errors.DEFAULT_ERROR_OPEN_POSITION;
}

export function useOpenMTPMutation() {
  const { data: signerAddress } = useSifSignerAddress();
  const { data: signingStargateClient } = useSifSigningStargateClient();

  async function mutation(variables: OpenMTPVariables) {
    invariant(signerAddress !== undefined, "Sif signer is not defined");

    return await signingStargateClient?.signAndBroadcast(
      signerAddress,
      [
        {
          typeUrl: "/sifnode.margin.v1.MsgOpen",
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
      toastId = toast.info("Opening margin position", {
        isLoading: true,
        autoClose: false,
      });
    },
    onSettled(data, error) {
      toast.dismiss(toastId);
      console.group("Open MTP Error");
      console.log(data);
      console.log(error);
      console.groupEnd();

      if (data === undefined || Boolean(error) || isDeliverTxFailure(data)) {
        const errorMessage = isError(error)
          ? friendlyOpenMTPMutationErrorMessage(error.message)
          : friendlyOpenMTPMutationErrorMessage(data && data.rawLog ? data.rawLog : "");

        toast.error(`Error: ${errorMessage}`);
      } else if (data !== undefined && isDeliverTxSuccess(data)) {
        toast.success(`Successfully openned margin position`);
      }
    },
  });
}
