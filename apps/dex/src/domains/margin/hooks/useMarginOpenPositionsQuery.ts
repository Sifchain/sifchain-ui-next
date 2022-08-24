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
/**
 * Sample object returned by Data Services on 2022-08-19
 * https://data.sifchain.finance/beta/margin/openposition/sif1erl0zkpwxmw2ecgy5z6g8ztw4zdmqlcpc99yjn?offset=0&limit=16&orderBy=health&sortBy=asc
{
  address: "sif1erl0zkpwxmw2ecgy5z6g8ztw4zdmqlcpc99yjn"
  collateral_amount: "1000000000000000000"
  collateral_asset: "ceth"
  current_custody_amount: null
  current_price: null
  custody_amount: "429945952788956991568096"
  custody_asset: "rowan"
  custody_entry_price: 0
  date_opened: "2022-08-16T22:57:09.000Z"
  health: "1.987563915515757381"
  id: "42"
  interest_paid: null
  interest_rate: "0.000000000005000000"
  leverage: "2.000000000000000000"
  mtp_open_execution_price: 429945.952788957
  next_payment: null
  paid_interest: null
  pool: "ceth"
  position: "LONG"
  repay_amount: 0
  time_open: {days: 1, hours: 1, minutes: 2, seconds: 51}
  unrealized_pnl: null
  unsettled_interest: null
}
*/
export type OpenPositionsQueryData = {
  address: string;
  collateral_amount: string;
  collateral_asset: string;
  current_price: string;
  custody_amount: string;
  custody_asset: string;
  custody_entry_price: number;
  date_opened: string;
  health: string;
  id: string;
  interest_rate: string;
  interest_paid: string;
  leverage: string;
  next_payment: string;
  paid_interest: string;
  pool: string;
  position: string;
  time_open: { hours: number; minutes: number; seconds: number };
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
