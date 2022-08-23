import { isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import type * as MarginTX from "@sifchain/proto-types/sifnode/margin/v1/tx";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant, toast } from "@sifchain/ui";
import { isError, useMutation } from "react-query";

import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";
import { transformMTPMutationErrors } from "./transformMTPMutationErrors";

export type CloseMTPVariables = Omit<MarginTX.MsgClose, "signer">;

export function useCloseMTPMutation() {
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
      console.log(error);
      console.groupEnd();

      if (data === undefined || Boolean(error) || isDeliverTxFailure(data)) {
        const errorMessage = isError(error)
          ? `Failed to close margin position: ${transformMTPMutationErrors(error.message)}`
          : data?.rawLog ?? "Failed to close margin position";

        toast.error(errorMessage);
      } else if (data !== undefined && isDeliverTxSuccess(data)) {
        toast.success(`Successfully closed margin position`);
      }
    },
  });
}
