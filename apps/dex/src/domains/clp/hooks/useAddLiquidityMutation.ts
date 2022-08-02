import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant } from "@sifchain/ui";
import { useMutation } from "react-query";
import useSifSigner from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";

const useAddLiquidityMutation = () => {
  const { signer } = useSifSigner();
  const { data: stargateClient } = useSifSigningStargateClient();

  const baseMutation = useMutation(
    async (variables: { nativeAmount: string; externalAmount: string }) => {
      invariant(signer !== undefined, "signer is undefined");
      invariant(stargateClient !== undefined, "stargateClient is undefined");

      const signerAddress = (await signer.getAccounts())[0]?.address ?? "";

      return stargateClient.signAndBroadcast(
        signerAddress,
        [
          {
            typeUrl: "/sifnode.clp.v1.MsgAddLiquidity",
            value: {
              signer: signerAddress,
              nativeAssetAmount: variables.nativeAmount,
              externalAssetAmount: variables.externalAmount,
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

export default useAddLiquidityMutation;
