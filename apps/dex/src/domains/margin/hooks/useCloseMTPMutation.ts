import type * as MarginTX from "@sifchain/proto-types/sifnode/margin/v1/tx";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant, toast } from "@sifchain/ui";
import { useMutation, isError } from "react-query";

import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";

export type CloseMTPVariables = Omit<MarginTX.MsgClose, "signer">;

export function useCloseMTPMutation() {
  const { data: signerAddress } = useSifSignerAddress();
  const { data: signingStargateClient } = useSifSigningStargateClient();

  async function mutation(variables: CloseMTPVariables) {
    invariant(signerAddress !== undefined, "Sif signer is not defined");

    return await signingStargateClient?.signAndBroadcast(
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

  return useMutation(mutation, {
    onMutate() {
      toast.info("Close MTP inprogress");
    },
    onSuccess() {
      toast.success("Close MTP success");
    },
    onError(error) {
      if (isError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Failed to close MTP");
      }
    },
  });
}
