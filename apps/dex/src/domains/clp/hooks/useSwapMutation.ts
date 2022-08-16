import { Decimal } from "@cosmjs/math";
import { isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { toast } from "@sifchain/ui";
import { useMutation } from "react-query";

import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useSifSigner from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";

export function useSwapMutation() {
  const { signer } = useSifSigner();
  const { data: signingStargateClient } = useSifSigningStargateClient();
  const { indexedByDenom } = useTokenRegistryQuery();

  return useMutation(
    async (variables: {
      fromDenom: string;
      toDenom: string;
      fromAmount: string;
      minimumReceiving: string;
    }) => {
      const signerAddress = (await signer?.getAccounts())?.[0]?.address ?? "";
      return signingStargateClient?.signAndBroadcast(
        signerAddress,
        [
          {
            typeUrl: "/sifnode.clp.v1.MsgSwap",
            value: {
              signer: signerAddress,
              sentAsset: { symbol: variables.fromDenom },
              receivedAsset: { symbol: variables.toDenom },
              sentAmount: variables.fromAmount ?? "0",
              minReceivingAmount: variables.minimumReceiving ?? "0",
            },
          },
        ],
        DEFAULT_FEE
      );
    },
    {
      onMutate: () => {
        toast.info("Swapping inprogress");
      },
      onSettled: (data, error, variables) => {
        if (data === undefined || Boolean(error) || isDeliverTxFailure(data)) {
          toast.error(data?.rawLog ?? "Failed to swap");
        } else if (data !== undefined && isDeliverTxSuccess(data)) {
          const fromCoin = indexedByDenom[variables.fromDenom];
          const toCoin = indexedByDenom[variables.toDenom];
          const fromSymbol = fromCoin?.displaySymbol;
          const toSymbol = toCoin?.displaySymbol;

          const fromDisplayAmount = Decimal.fromAtomics(
            variables.fromAmount,
            fromCoin?.decimals ?? 0
          ).toString();
          const toDisplayAmount = Decimal.fromAtomics(
            variables.minimumReceiving,
            toCoin?.decimals ?? 0
          ).toString();

          toast.success(
            `Successfully swapped ${fromDisplayAmount} ${fromSymbol} for >=${toDisplayAmount} ${toSymbol}`
          );
        }
      },
    }
  );
}
