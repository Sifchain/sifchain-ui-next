import type * as MarginTX from "@sifchain/proto-types/sifnode/margin/v1/tx";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant, toast } from "@sifchain/ui";
import { isError, useMutation } from "react-query";

import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";

export type OpenMTPVariables = Omit<MarginTX.MsgOpen, "signer">;

export function useOpenMTPMutation() {
  const { data: signerAddress } = useSifSignerAddress();
  const { data: signingStargateClient } = useSifSigningStargateClient();

  async function mutation(variables: OpenMTPVariables) {
    invariant(signerAddress !== undefined, "Sif signer is not defined");

    return signingStargateClient?.signAndBroadcast(
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

  return useMutation(mutation, {
    onMutate() {
      toast.info("Open MTP inprogress");
    },
    onSuccess() {
      toast.success("Open MTP success");
    },
    onError(error) {
      if (isError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Failed to open MTP");
      }
    },
  });
}
