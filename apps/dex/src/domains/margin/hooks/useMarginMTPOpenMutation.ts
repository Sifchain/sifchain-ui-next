import type * as MarginTX from "@sifchain/proto-types/sifnode/margin/v1/tx";

import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant, toast } from "@sifchain/ui";
import { isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import { useMutation, useQueryClient } from "react-query";

import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";

import * as errors from "./mutationErrorMessage";
import type { MTPOpenResponse, OpenPositionsQueryData, Pagination } from "./types";

export type OpenMTPVariables = Omit<MarginTX.MsgOpen, "signer">;

export function useMarginMTPOpenMutation() {
  const { data: signerAddress } = useSifSignerAddress();
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
    async onSuccess(data) {
      if (data && data.rawLog) {
        let payload;
        try {
          payload = JSON.parse(data.rawLog) as MTPOpenResponse;
        } catch (err) {
          console.group("JSON.parse MTP Open Optimistic Updates Error");
          console.log({ err });
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
            custody_amount, // Open Positions Column: Position (Token amount)
            leverage, // Open Positions Column: Leverage (2x)
            _liabilities,
            _interest_paid_collateral,
            interest_paid_custody, // Open Positions Column: Interest Paid (Token amount)
            _interest_unpaid_collateral,
            health, // Open Positions Column: Liquidation ratio (From 0 to 1)
          ] = marginMtpOpen.attributes;

          const queriesNameToAddData = ["margin.getMarginOpenPositionBySymbol", "margin.getMarginOpenPosition"];

          const newOpenPosition = {
            id: id.value,
            position: position.value,
            address: address.value,
            collateral_asset: collateral_asset.value,
            custody_asset: custody_asset.value,
            custody_amount: custody_amount.value,
            leverage: leverage.value,
            interest_paid_custody: interest_paid_custody.value,
            health: health.value,
            _optimistic: true,
          };
          /**
           * We are using React Query Optimistic Updates in "useMarginMTPOpenMutation"
           * To avoid removing the optimistic item too soon from the UI, we need to
           * increasing the refresh time "useMarginOpenPositionsBySymbolQuery"
           * to allow Data Services to do their job
           *
           * If in the next fetch window (after 20 seconds), Data Services response
           * DOESN'T include the new item, the optimistic item will be REMOVED from the UI
           * we are not doing a diff in the Data Service response x local cache
           *
           * Data Services response is our source of truth
           */
          queryClient.setQueriesData(
            {
              predicate(query) {
                return queriesNameToAddData.includes(query.queryKey[0] as string);
              },
            },
            (state) => {
              const draft = state as { pagination: Pagination; results: Partial<OpenPositionsQueryData>[] } | undefined;
              if (draft) {
                draft.pagination = {
                  ...draft.pagination,
                  limit: `${Number(draft.pagination.limit) + 1}`,
                  total: `${Number(draft.pagination.total) + 1}`,
                };
                draft.results = [newOpenPosition, ...draft.results];
              }
              return draft;
            },
          );
        }
      }
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
