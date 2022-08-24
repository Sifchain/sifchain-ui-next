import { isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import type * as MarginTX from "@sifchain/proto-types/sifnode/margin/v1/tx";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant, toast } from "@sifchain/ui";
import { isError, useMutation } from "react-query";

import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";

export type OpenMTPVariables = Omit<MarginTX.MsgOpen, "signer">;

const OPEN_MTP_ERRORS = {
  NOT_ENOUGH_BALANCE: "You dont have enough balance of the required coin",
};

export function friendlyOpenMTPMutationErrorMessage(error: string) {
  if (error.includes("unauthorized")) {
    return "Your account has not yet been approved for margin trading.";
  }

  if (error.includes("margin not enabled for pool")) {
    return "Trade is temporarily disabled for this pool.";
  }

  if (error.includes("max open positions reached")) {
    return "Pool limit for open positions reached. Try again later.";
  }

  if (error.includes("Account does not exist on chain")) {
    return error;
  }

  console.group("Missing Friendly Error Message for Open MTP error:");
  console.log(error);
  console.groupEnd();
  return "Failed to open margin position";
}

export function useOpenMTPMutation() {
  const { data: signerAddress } = useSifSignerAddress();
  const { data: signingStargateClient } = useSifSigningStargateClient();

  async function mutation(variables: OpenMTPVariables) {
    invariant(signerAddress !== undefined, "Sif signer is not defined");

    const req = await signingStargateClient?.signAndBroadcast(
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

    if (req?.rawLog?.includes("user does not have enough balance of the required coin")) {
      throw new Error(OPEN_MTP_ERRORS.NOT_ENOUGH_BALANCE);
    }

    return req;
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

        toast.error(errorMessage);
      } else if (data !== undefined && isDeliverTxSuccess(data)) {
        toast.success(`Successfully openned margin position`);
      }
    },
  });
}
