import { Coin, isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import { isEvmBridgedCoin } from "@sifchain/common";
import { useConnect } from "@sifchain/cosmos-connect";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { toast } from "@sifchain/ui";
import { addMinutes, getUnixTime } from "date-fns";
import { ContractTransaction, ethers } from "ethers";
import { isNil } from "rambda";
import { useMutation } from "react-query";
import { useSigner } from "wagmi";
import { useDexEnvironment } from "~/domains/core/envs";
import useEvmSdk from "~/hooks/useEvmSdk";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";

export const useImportTokensMutation = () => {
  const { refetch: refetchDexEnv } = useDexEnvironment();
  const { refetch: refetchStargateClient } = useSifSigningStargateClient();
  const { refetch: refetchEvmSdk } = useEvmSdk();
  const { refetch: refetchSigner } = useSigner();
  const { activeConnector } = useConnect();

  return useMutation(
    async (variables: {
      chainId: string;
      tokenAddress: string;
      recipientAddress: string;
      amount: Coin;
      memo?: string;
    }) => {
      if (isEvmBridgedCoin(variables.amount)) {
        const { data: env } = await refetchDexEnv();
        const { data: evmSdk } = await refetchEvmSdk();
        const { data: signer } = await refetchSigner();

        if (isNil(evmSdk)) {
          throw new Error("Unable to fetch EVM SDK");
        }

        if (isNil(signer)) {
          throw new Error("No EVM signer found, please connect your wallet");
        }

        const erc20Abi = [
          "function approve(address _spender, uint256 _value) public returns (bool success)",
        ];
        const contract = new ethers.Contract(
          variables.tokenAddress,
          erc20Abi,
          signer
        );

        await contract["approve"](
          env?.bridgebankContractAddress,
          variables.amount.amount
        ).then((x: ContractTransaction) => x.wait());

        return evmSdk.peggy
          .sendTokensToCosmos(
            ethers.utils.toUtf8Bytes(variables.recipientAddress),
            variables.tokenAddress,
            variables.amount.amount
          )
          .then((x) => x.wait());
      } else {
        const { data: stargateClient } = await refetchStargateClient();

        if (stargateClient === undefined) {
          throw new Error("Could not get wallet connection for sifchain");
        }

        const counterPartySigningStargateClient =
          await activeConnector?.getSigningStargateClient(variables.chainId);

        if (counterPartySigningStargateClient === undefined) {
          throw new Error(
            `Could not get wallet connection for ${variables.chainId}`
          );
        }

        const counterPartyAccounts = await activeConnector
          ?.getSigner(variables.chainId)
          .then((x) => x.getAccounts());

        return stargateClient.importIbcTokens(
          counterPartySigningStargateClient,
          counterPartyAccounts?.[0]?.address ?? "",
          variables.recipientAddress,
          variables.amount,
          "transfer",
          undefined,
          getUnixTime(addMinutes(new Date(), 15)),
          DEFAULT_FEE,
          variables.memo
        );
      }
    },
    {
      onMutate: () => {
        toast.info("Import inprogress");
      },
      onSettled: (data, error) => {
        if (!isNil(error)) {
          if (error instanceof Error || "message" in (error as Error)) {
            toast.error((error as Error).message);
          } else {
            toast.error("Failed to import");
          }
          return;
        }

        if (data === undefined) return;

        if ("events" in data) {
          switch (data.status) {
            case 0:
              toast.error(data.logs.join() ?? "Failed to import");
              break;
            case 1:
              toast.success(`Successfully imported`);
          }
        } else if ("height" in data) {
          if (Boolean(error) || isDeliverTxFailure(data)) {
            toast.error(data?.rawLog ?? "Failed to import");
          } else if (data !== undefined && isDeliverTxSuccess(data)) {
            toast.success(`Successfully imported`);
          }
        }
      },
    }
  );
};
