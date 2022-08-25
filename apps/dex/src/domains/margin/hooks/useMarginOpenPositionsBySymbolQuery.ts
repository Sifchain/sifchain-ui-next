import type { Pagination, OpenPositionsQueryData } from "./types";
import type { UseQueryResult } from "react-query";

import { useRouter } from "next/router";

import useSifApiQuery from "~/hooks/useSifApiQuery";

import { QS_DEFAULTS } from "~/compounds/Margin/_tables";
import { useSifSignerAddress } from "~/hooks/useSifSigner";

export function useMarginOpenPositionsBySymbolQuery({ poolSymbol }: { poolSymbol: string }) {
  const router = useRouter();
  const walletAddress = useSifSignerAddress();
  const params = {
    walletAddress: walletAddress.data ?? "",
    poolSymbol,
    limit: (router.query["limit"] as string) || QS_DEFAULTS.limit,
    offset: (router.query["offset"] as string) || QS_DEFAULTS.offset,
    orderBy: (router.query["orderBy"] as string) || "date_opened",
    sortBy: (router.query["sortBy"] as string) || QS_DEFAULTS.sortBy,
  };
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
      keepPreviousData: true,
      /**
       * We are using React Query Optimistic Updates in "useMarginMTPOpenMutation"
       * To avoid removing the optimistic item too soon from the UI, we need to
       * increasing the refresh time "useMarginOpenPositionsBySymbolQuery"
       * to allow Data Services to do their job
       *
       * If in the next fetch window (after 15 seconds), Data Services response
       * DOESN'T include the new item, the optimistic item will be REMOVED from the UI
       * we are not doing a diff in the Data Service response x local cache
       *
       * Data Services response is our source of truth
       */
      refetchInterval: 30 * 1000,
      retry: false,
    },
  ) as UseQueryResult<{
    pagination: Pagination;
    results: OpenPositionsQueryData[];
  }>;
}
