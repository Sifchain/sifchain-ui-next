import { isDeliverTxFailure, isDeliverTxSuccess } from "@cosmjs/stargate";
import type * as MarginTX from "@sifchain/proto-types/sifnode/margin/v1/tx";
import { DEFAULT_FEE } from "@sifchain/stargate";
import { invariant, toast } from "@sifchain/ui";
import { useMutation, useQueryClient } from "react-query";

import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useSifSigningStargateClient } from "~/hooks/useSifStargateClient";
import * as errors from "./mutationErrorMessage";
import type { HistoryQueryData, MTPCloseResponse, OpenPositionsQueryData, Pagination } from "./types";

export type CloseMTPVariables = Omit<MarginTX.MsgClose, "signer">;

type UseMarginMTPCloseMutationProps = {
  _optimisticCustodyAmount: string;
};
export function useMarginMTPCloseMutation({ _optimisticCustodyAmount }: UseMarginMTPCloseMutationProps) {
  const { data: signerAddress } = useSifSignerAddress();
  const { data: signingStargateClient } = useSifSigningStargateClient();
  const queryClient = useQueryClient();

  async function mutation(variables: CloseMTPVariables) {
    invariant(signerAddress !== undefined, "Sif signer is not defined");
    invariant(signingStargateClient !== undefined, "Sif signing stargate client is not defined");

    const res = await signingStargateClient.signAndBroadcast(
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

    if (res && isDeliverTxFailure(res) && res.rawLog) {
      console.group("Close MTP Error");
      console.log({ error: res });
      console.groupEnd();

      if (
        res.rawLog.includes("unauthorized") ||
        res.rawLog.includes("unauthorised") ||
        res.rawLog.includes("address not on whitelist")
      ) {
        throw new Error(errors.ACCOUNT_NOT_APPROVED_FOR_TRADING);
      }

      if (res.rawLog.includes("mtp not found")) {
        throw new Error(errors.MTP_NOT_FOUND);
      }

      throw new Error(errors.DEFAULT_ERROR_CLOSE_POSITION);
    }

    return res;
  }

  let toastId: string | number;

  return useMutation(mutation, {
    onMutate() {
      toastId = toast.info("Closing margin position", {
        isLoading: true,
        autoClose: false,
      });
    },
    async onSuccess(data) {
      if (data && data.rawLog) {
        let payload;
        try {
          payload = JSON.parse(data.rawLog) as MTPCloseResponse;
        } catch (error) {
          console.group("JSON.parse MTP Close Optimistic Updates Error");
          console.log({ error });
          console.groupEnd();
        }

        if (payload) {
          const [_coinReceived, _coinSpent, marginMtpClose] = payload[0].events;
          const [
            id, // MTP ID
            position, // History Column: Side (LONG|SHORT)
            _address,
            collateral_asset,
            _collateral_amount,
            custody_asset,
            _custody_amount,
            _repay_amount,
            _leverage,
            _liabilities,
            _interest_paid_collateral,
            interest_paid_custody,
            _interest_unpaid_collateral,
            _health,
          ] = marginMtpClose.attributes;

          const queriesNameToRemoveData = ["margin.getMarginOpenPositionBySymbol", "margin.getMarginOpenPosition"];

          queryClient.setQueriesData(
            {
              predicate(query) {
                return queriesNameToRemoveData.includes(query.queryKey[0] as string);
              },
            },
            (state) => {
              const draft = state as { pagination: Pagination; results: Partial<OpenPositionsQueryData>[] } | undefined;
              if (draft) {
                draft.pagination = {
                  ...draft.pagination,
                  limit: `${Number(draft.pagination.limit) - 1}`,
                  total: `${Number(draft.pagination.total) - 1}`,
                };
                draft.results = [...draft.results.filter((x) => x.id !== id.value)];
              }
              return draft;
            },
          );

          const queriesNameToAddData = ["margin.getMarginHistory"];

          const newHistoryPosition = {
            close_interest_paid_custody: interest_paid_custody.value,
            closed_date_time: undefined,
            id: id.value,
            open_custody_amount: _optimisticCustodyAmount,
            open_custody_asset: custody_asset.value,
            open_date_time: undefined,
            pool: collateral_asset.value,
            position: position.value,
            realized_pnl: undefined,
            _optimistic: true,
          };

          queryClient.setQueriesData(
            {
              predicate(query) {
                return queriesNameToAddData.includes(query.queryKey[0] as string);
              },
            },
            (state) => {
              const draft = state as { pagination: Pagination; results: Partial<HistoryQueryData>[] } | undefined;
              if (draft) {
                draft.pagination = {
                  ...draft.pagination,
                  limit: `${Number(draft.pagination.limit) + 1}`,
                  total: `${Number(draft.pagination.total) + 1}`,
                };
                draft.results = [newHistoryPosition, ...draft.results];
              }
              return draft;
            },
          );

          /**
           * There's two places we can close a position:
           *   - Trade (open positions by pool symbol)
           *   - Positions (all open positions)
           * We use different queries in each place
           */
          queryClient.cancelQueries(["margin.getMarginOpenPositionBySymbol"]);
          queryClient.cancelQueries(["margin.getMarginOpenPosition"]);
        }
      }
    },
    onSettled(data, error) {
      toast.dismiss(toastId);
      if (data === undefined && Boolean(error)) {
        const { message } = error as Error;
        toast.error(message);
      } else if (data !== undefined && isDeliverTxSuccess(data)) {
        toast.success(`Successfully closed margin position`);
      }
    },
  });
}
