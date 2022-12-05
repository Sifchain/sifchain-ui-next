import type * as MarginTX from "@sifchain/proto-types/sifnode/margin/v1/tx";

import { isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { toast } from "@sifchain/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import invariant from "tiny-invariant";

import { useSifSignerAddressQuery } from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";

import * as errors from "./mutationErrorMessage";
import type { MTPOpenResponse } from "./types";

export type OpenMTPVariables = Omit<MarginTX.MsgOpen, "signer">;

type UseMarginMTPOpenMutationProps = {
  poolSymbol: string;
  _optimisticCustodyAmount: string;
};
export function useMarginMTPOpenMutation(props: UseMarginMTPOpenMutationProps) {
  const { data: signerAddress } = useSifSignerAddressQuery();
  const { data: signingStargateClient } = useSifSigningStargateClient();
  const queryClient = useQueryClient();

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

      // ========================================
      // Wallet address/Account errors
      // ========================================
      if (
        res.rawLog.includes("unauthorized") ||
        res.rawLog.includes("unauthorised") ||
        res.rawLog.includes(errors.SIFNODE_ERRORS.ADDRESS_NOT_ON_WHITELIST)
      ) {
        throw new Error(errors.ACCOUNT_NOT_APPROVED_FOR_TRADING);
      }

      if (res.rawLog.includes("user does not have enough balance of the required coin")) {
        throw new Error(errors.ACCOUNT_NOT_ENOUGH_BALANCE);
      }

      if (res.rawLog.includes("Account does not exist on chain")) {
        throw new Error(errors.ACCOUNT_NOT_IN_SIFCHAIN);
      }

      // ========================================
      // Pools errors
      // ========================================
      if (res.rawLog.includes(errors.SIFNODE_ERRORS.MARGIN_NOT_ENABLED_FOR_POOL)) {
        throw new Error(errors.POOL_TRADE_TEMPORARILY_DISABLED);
      }

      if (res.rawLog.includes(errors.SIFNODE_ERRORS.MAX_OPEN_POSITIONS_REACHED)) {
        throw new Error(errors.POOL_MAX_OPEN_POSITIONS_REACHED);
      }

      // ========================================
      // MTP Open errors
      // ========================================
      if (res.rawLog.includes(errors.SIFNODE_ERRORS.BORROWED_AMOUNT_IS_TOO_LOW)) {
        throw new Error(errors.MTP_LOW_BORROWED_AMOUNT);
      }

      if (res.rawLog.includes(errors.SIFNODE_ERRORS.BORROWED_AMOUNT_IS_HIGHER_THAN_POOL_DEPTH)) {
        throw new Error(errors.MTP_BORROWED_HIGHER_THAN_POOL_DEPTH);
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
    async onSuccess(data) {
      if (data?.rawLog) {
        let payload;
        try {
          payload = JSON.parse(data.rawLog) as MTPOpenResponse;
        } catch (error) {
          console.group("JSON.parse MTP Open Optimistic Updates Error");
          console.log({ error });
          console.groupEnd();
        }

        if (payload) {
          const [_coinReceived, _coinSpent, marginMtpOpen] = payload[0].events;

          const [
            id, // MTP ID
            position, // Open Positions Column: Side (LONG|SHORT)
            address, // The user that opened a trade wallet address
            collateral_asset, // Open Positions Column: Pool (USDC|ROWAN)
            _collateral_amount,
            custody_asset, // Open Positions Column: Asset (ROWAN|USDC)
            _custody_amount, // Open Positions Column: Position (Token amount)
            leverage, // Open Positions Column: Leverage (2x)
            _liabilities,
            _interest_paid_collateral,
            interest_paid_custody, // Open Positions Column: Interest Paid (Token amount)
            _interest_unpaid_collateral,
            health, // Open Positions Column: Liquidation ratio (From 0 to 1)
          ] = marginMtpOpen.attributes;

          const newOpenPosition = {
            id: id.value,
            position: position.value,
            address: address.value,
            collateral_asset: collateral_asset.value,
            custody_asset: custody_asset.value,
            custody_amount: props._optimisticCustodyAmount,
            leverage: leverage.value,
            interest_paid_custody: interest_paid_custody.value,
            health: health.value,
            _optimistic: true,
          };

          queryClient.setQueryData<typeof newOpenPosition[] | undefined>(
            ["margin.getOptimisticPositions"],
            (oldData) => {
              if (oldData) {
                return oldData.concat(newOpenPosition);
              }
              return [newOpenPosition];
            },
          );

          queryClient.invalidateQueries(["margin.getMarginOpenPositionBySymbol"]);
          queryClient.invalidateQueries(["margin.getMarginOpenPosition"]);
          queryClient.invalidateQueries(["all-balances"]);
          queryClient.invalidateQueries(["assets.getTokenStatsPMTP"]);
          queryClient.invalidateQueries(["enhanced-pools"]);
        }
      }
    },
    onSettled(data, error) {
      toast.dismiss(toastId);
      if (data === undefined && Boolean(error)) {
        const { message } = error as Error;
        toast.error(message);
      } else if (data !== undefined && isDeliverTxSuccess(data)) {
        toast.success("Successfully opened margin position");
      }
    },
  });
}
