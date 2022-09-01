import type { MarginHistoryResponse } from "./types";
import type { UseQueryResult } from "@tanstack/react-query";

import useSifApiQuery from "~/hooks/useSifApiQuery";

import { syncCacheWithServer } from "../utilts/syncCacheWithServer";

export function useMarginHistoryQuery(params: {
  walletAddress: string;
  offset: string;
  limit: string;
  orderBy: string;
  sortBy: string;
}) {
  return useSifApiQuery(
    "margin.getMarginHistory",
    [params.walletAddress, Number(params.offset), Number(params.limit), params.orderBy, params.sortBy],
    {
      enabled: Boolean(params.walletAddress),
      keepPreviousData: true,
      /**
       * We are using React Query Optimistic Updates in "useMarginMTPCloseMutation"
       * To avoid removing the optimistic item too soon from the UI, we need to
       * increasing the refresh time in "useMarginHistory"
       * to allow Data Services to do their job
       *
       * If in the next fetch window (after 10 seconds), Data Services response
       * DOESN'T remove the old item, the item will APPEAR again in the UI
       * we are not doing a diff in the Data Service response x local cache
       *
       * Data Services response is our source of truth
       */
      refetchInterval: 10 * 1000,
      retry: false,
      structuralSharing(oldData: MarginHistoryResponse | undefined, newData: MarginHistoryResponse | undefined) {
        if (oldData && newData) {
          return syncCacheWithServer<MarginHistoryResponse>(oldData, newData);
        }
        return newData;
      },
    },
  ) as UseQueryResult<MarginHistoryResponse>;
}
