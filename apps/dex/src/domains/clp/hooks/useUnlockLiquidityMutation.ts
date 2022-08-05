import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant } from "@sifchain/ui";
import { useMutation } from "react-query";
import useSifSigner from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";

const useUnlockLiquidityMutation = () => {
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
            typeUrl: "/sifnode.clp.v1.MsgUnlockLiquidityRequest",
            value: {
              signer: signerAddress,
              externalAsset: { symbol: variables.denom },
              units: variables.units,
            },
          },
        ],
        DEFAULT_FEE,
      );
    },
  );

  return {
    ...baseMutation,
    isReady: signer !== undefined && stargateClient !== undefined,
  };
};

export default useUnlockLiquidityMutation;
