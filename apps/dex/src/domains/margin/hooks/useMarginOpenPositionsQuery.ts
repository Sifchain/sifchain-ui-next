import type { GetMarginOpenPositionResponse } from "@sifchain/sif-api";
import type { UseQueryResult } from "react-query";
import useSifApiQuery from "~/hooks/useSifApiQuery";

type Pagination = {
  total: string;
  limit: string;
  offset: string;
  order_by: string;
  sort_by: string;
};

type OpenPositionsQueryParams = {
  walletAddress: string;
  offset: string;
  limit: string;
  orderBy: string;
  sortBy: string;
};

export type OpenPositionsQueryData = {
  id: string;
  address: string;
  pool: string;
  position: string;
  custody_amount: string;
  unrealized_pnl: string;
  custody_asset: string;
  unsettled_interest: string;
  next_payment: string;
  date_opened: string;
  time_open: string;
  interest_rate: string;
  paid_interest: string;
  health: string;
  leverage: string;
};

export function useOpenPositionsQuery(params: OpenPositionsQueryParams) {
  return useSifApiQuery(
    "margin.getMarginOpenPosition",
    [
      params.walletAddress,
      Number(params.offset),
      Number(params.limit),
      params.orderBy,
      params.sortBy,
    ],
    {
      enabled: Boolean(params.walletAddress),
      refetchInterval: 6000,
      keepPreviousData: true,
      retry: false,
    }
  ) as UseQueryResult<{
    pagination: Pagination;
    results: OpenPositionsQueryData[];
  }>;
}
