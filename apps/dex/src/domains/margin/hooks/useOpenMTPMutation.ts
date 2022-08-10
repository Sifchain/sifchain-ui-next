import { DEFAULT_FEE } from "@sifchain/stargate";
import { useMutation } from "react-query";
import type * as MarginTX from "@sifchain/proto-types/sifnode/margin/v1/tx";

import useSifSigner from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";

export type OpenMTPVariables = Omit<MarginTX.MsgOpen, "signer">;

export function useOpenMTPMutation() {
  const { signer } = useSifSigner();
  const { data: signingStargateClient } = useSifSigningStargateClient();

  async function mutation(variables: OpenMTPVariables) {
    const signerAddress = (await signer?.getAccounts())?.[0]?.address ?? "";

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

  return useMutation(mutation);
}

export type CloseMTPVariables = Omit<MarginTX.MsgClose, "signer">;

export function useCloseMTPMutation() {
  const { signer } = useSifSigner();
  const { data: signingStargateClient } = useSifSigningStargateClient();

  async function mutation(variables: CloseMTPVariables) {
    const signerAddress = (await signer?.getAccounts())?.[0]?.address ?? "";

    return signingStargateClient?.signAndBroadcast(
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

  return useMutation(mutation);
}
