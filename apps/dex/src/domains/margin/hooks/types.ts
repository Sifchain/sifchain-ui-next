export type Pagination = {
  total: string;
  limit: string;
  offset: string;
  order_by: string;
  sort_by: string;
};

export type OpenPositionsQueryData = {
  address: string;
  pool: string;
  current_custody_amount: number;
  current_price: any;
  custody_amount: string;
  custody_asset: string;
  collateral_amount: string;
  collateral_asset: string;
  date_opened: string;
  time_open: TimeOpen;
  health: string;
  id: string;
  custody_entry_price: number;
  interest_paid?: number;
  interest_rate: string;
  unsettled_interest: any;
  leverage: string;
  mtp_open_execution_price: number;
  next_payment: any;
  paid_interest: any;
  position: string;
  repay_amount: number;
  unrealized_pnl: any;
};

export type TimeOpen = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};
