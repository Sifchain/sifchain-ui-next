import type { UseQueryResult } from "react-query";
import useSifApiQuery from "~/hooks/useSifApiQuery";

type Pagination = {
  total: string;
  limit: string;
  offset: string;
  order_by: string;
  sort_by: string;
};

export function useHistoryQuery(params: {
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
      queryHash: JSON.stringify(params),
      refetchInterval: 6000,
      retry: false,
    },
  ) as UseQueryResult<{
    pagination: Pagination;
    results: {
      id: string;
      open_custody_amount: string;
      open_custody_asset: string;
      open_date_time: string;
      closed_date_time: string;
      open_health: string;
      open_leverage: string;
      position: string;
      realized_pnl: string;
      type: string;
      next_payment: string;
      paid_interest: string;
      unsettled_interest: string;
      mtp_close_custody_amount: string;
      mtp_close_execution_price: string;
      mtp_open_custody_amount: string;
      mtp_open_execution_price: string;
    }[];
  }>;
}
