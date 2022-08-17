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
  address: string;
  collateral_amount: string;
  collateral_asset: string;
  current_price: string;
  custody_amount: string;
  custody_asset: string;
  date_opened: string;
  health: string;
  id: string;
  interest_rate: string;
  leverage: string;
  next_payment: string;
  paid_interest: string;
  pool: string;
  position: string;
  time_open: string;
  unrealized_pnl: string;
  unsettled_interest: string;
};

export function useOpenPositionsQuery(params: OpenPositionsQueryParams) {
  return useSifApiQuery(
    "margin.getMarginOpenPosition",
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
    results: OpenPositionsQueryData[];
  }>;
}
