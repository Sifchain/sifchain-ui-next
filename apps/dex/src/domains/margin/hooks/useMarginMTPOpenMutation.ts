import { isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import type * as MarginTX from "@sifchain/proto-types/sifnode/margin/v1/tx";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant, toast } from "@sifchain/ui";
import { isError, useMutation } from "react-query";

import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";
import * as errors from "./mutationErrorMessage";

export type OpenMTPVariables = Omit<MarginTX.MsgOpen, "signer">;

export function useMarginMTPOpenMutation() {
  const { data: signerAddress } = useSifSignerAddress();
  const { data: signingStargateClient } = useSifSigningStargateClient();

  async function mutation(variables: OpenMTPVariables) {
    invariant(signerAddress !== undefined, "Sif signer is not defined");

    const res = await signingStargateClient?.signAndBroadcast(
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

    if (res && isDeliverTxFailure(res) && res.rawLog) {
      console.group("Open MTP Error");
      console.log({ error: res });
      console.groupEnd();

      if (
        res.rawLog.includes("unauthorized") ||
        res.rawLog.includes("unauthorised") ||
        res.rawLog.includes("address not on whitelist")
      ) {
        throw new Error(errors.ACCOUNT_NOT_APPROVED_FOR_TRADING);
      }

      if (res.rawLog.includes("margin not enabled for pool")) {
        throw new Error(errors.POOL_TRADE_TEMPORARILY_DISABLED);
      }

      if (res.rawLog.includes("max open positions reached")) {
        throw new Error(errors.POOL_MAX_OPEN_POSITIONS_REACHED);
      }

      if (res.rawLog.includes("user does not have enough balance of the required coin")) {
        throw new Error(errors.ACCOUNT_NOT_ENOUGH_BALANCE);
      }

      if (res.rawLog.includes("Account does not exist on chain")) {
        throw new Error(errors.ACCOUNT_NOT_IN_SIFCHAIN);
      }

      throw new Error(errors.DEFAULT_ERROR_OPEN_POSITION);
    }

    return res;
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
      if (data === undefined && Boolean(error)) {
        const { message } = error as Error;
        toast.error(message);
      } else if (data !== undefined && isDeliverTxSuccess(data)) {
        toast.success(`Successfully openned margin position`);
      }
    },
  });
}
