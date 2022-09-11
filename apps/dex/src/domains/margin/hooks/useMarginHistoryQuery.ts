import type { MarginHistoryResponse } from "./types";
import { useQueryClient, UseQueryResult } from "@tanstack/react-query";

import useSifApiQuery from "~/hooks/useSifApiQuery";

import { syncCacheWithServer } from "../utilts/syncCacheWithServer";

export function useMarginHistoryQuery(params: {
  walletAddress: string;
  offset: string;
  limit: string;
  orderBy: string;
  sortBy: string;
}) {
  const queryClient = useQueryClient();
  const optimisticHistory = (queryClient.getQueryData(["margin.getOptimisticHistory"]) ??
    []) as MarginHistoryResponse["results"];

  return useSifApiQuery(
    "margin.getMarginHistory",
    [params.walletAddress, Number(params.offset), Number(params.limit), params.orderBy, params.sortBy],
    {
      enabled: Boolean(params.walletAddress),
      initialData: {
        pagination: {
          limit: params.limit,
          offset: params.offset,
          order_by: params.orderBy,
          sort_by: params.sortBy,
          total: String(optimisticHistory.length),
        },
        results: optimisticHistory,
      },
      keepPreviousData: true,
      refetchInterval: 10 * 1000,
      retry: false,
      /**
       * We are using React Query Optimistic Updates in "OpenPositions" and "History" tables
       * It can take a few seconds for Data Services to return a up to date response with new trades
       * Because of that, we need to create a diff of old data (current cache) and new data (latest Data Services response)
       */
      structuralSharing(oldData: MarginHistoryResponse | undefined, newData: MarginHistoryResponse | undefined) {
        if (oldData && newData) {
          const diffData = syncCacheWithServer(oldData, newData) as MarginHistoryResponse;
          queryClient.setQueryData(
            ["margin.getOptimisticHistory"],
            diffData.results.filter((x) => x._optimistic),
          );
          return diffData;
        }
        return newData;
      },
    },
  ) as UseQueryResult<MarginHistoryResponse>;
}
