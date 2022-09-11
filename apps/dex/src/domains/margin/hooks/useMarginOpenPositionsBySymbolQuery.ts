import type { MarginHistoryResponse, MarginOpenPositionsResponse } from "./types";
import { useQueryClient, UseQueryResult } from "@tanstack/react-query";

import { useRouter } from "next/router";

import useSifApiQuery from "~/hooks/useSifApiQuery";

import { QS_DEFAULTS } from "~/compounds/Margin/_tables";
import { useSifSignerAddressQuery } from "~/hooks/useSifSigner";

import { syncCacheWithServer } from "../utilts/syncCacheWithServer";
import { syncOptimisticHistoryWithPositions } from "../utilts/syncOptimisticHistoryWithPositions";

export function useMarginOpenPositionsBySymbolQuery({ poolSymbol }: { poolSymbol: string }) {
  const router = useRouter();
  const walletAddress = useSifSignerAddressQuery();
  const params = {
    walletAddress: walletAddress.data ?? "",
    poolSymbol,
    limit: (router.query["limit"] as string) || QS_DEFAULTS.limit,
    offset: (router.query["offset"] as string) || QS_DEFAULTS.offset,
    orderBy: (router.query["orderBy"] as string) || "date_opened",
    sortBy: (router.query["sortBy"] as string) || QS_DEFAULTS.sortBy,
  };
  const queryClient = useQueryClient();
  const optimisticPositions = (queryClient.getQueryData(["margin.getOptimisticPositions"]) ??
    []) as MarginOpenPositionsResponse["results"];

  return useSifApiQuery(
    "margin.getMarginOpenPositionBySymbol",
    [
      params.walletAddress,
      params.poolSymbol,
      Number(params.offset),
      Number(params.limit),
      params.orderBy,
      params.sortBy,
    ],
    {
      enabled: Boolean(params.walletAddress) && Boolean(params.poolSymbol),
      initialData: {
        pagination: {
          limit: params.limit,
          offset: params.offset,
          order_by: params.orderBy,
          sort_by: params.sortBy,
          total: String(optimisticPositions.length),
        },
        results: optimisticPositions,
      },
      keepPreviousData: true,
      refetchInterval: 10 * 1000,
      retry: false,
      /**
       * We are using React Query Optimistic Updates in "OpenPositions" and "History" tables
       * It can take a few seconds for Data Services to return a up to date response with new trades
       * Because of that, we need to create a diff of old data (current cache) and new data (latest Data Services response)
       */
      structuralSharing(
        oldData: MarginOpenPositionsResponse | undefined,
        newData: MarginOpenPositionsResponse | undefined,
      ) {
        if (oldData && newData) {
          const diffOptimisticPositions = (queryClient.getQueryData(["margin.getOptimisticPositions"]) ??
            []) as MarginOpenPositionsResponse["results"];

          const diffOptimisticHistory = (queryClient.getQueryData(["margin.getOptimisticHistory"]) ??
            []) as MarginHistoryResponse["results"];

          const diffPositions = syncCacheWithServer(
            {
              results: diffOptimisticPositions,
            },
            newData,
          ) as MarginOpenPositionsResponse;
          queryClient.setQueryData(
            ["margin.getOptimisticPositions"],
            diffPositions.results.filter((x) => x._optimistic),
          );

          const diffResults = syncOptimisticHistoryWithPositions(
            { results: diffOptimisticHistory },
            diffPositions,
          ) as MarginOpenPositionsResponse;

          return diffResults;
        }
        return newData;
      },
    },
  ) as UseQueryResult<MarginOpenPositionsResponse>;
}
