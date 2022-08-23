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
      queryHash: JSON.stringify(params),
      refetchInterval: 6000,
      retry: false,
    },
  ) as UseQueryResult<{
    pagination: Pagination;
    results: OpenPositionsQueryData[];
  }>;
}
