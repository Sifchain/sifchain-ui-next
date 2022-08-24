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
  current_custody_amount: any;
  current_price: number;
  custody_amount: string;
  custody_asset: string;
  collateral_amount: string;
  collateral_asset: string;
  date_opened: string;
  time_open: TimeOpen;
  health: string;
  id: string;
  liabilities: number;
  interest_paid_custody: string;
  interest_unpaid_collateral: string;
  interest_paid_collateral: string;
  custody_entry_price: number;
  interest_paid: any;
  interest_rate: string;
  leverage: string;
  mtp_open_execution_price: number;
  next_payment: any;
  paid_interest: any;
  position: string;
  repay_amount: number;
  unrealized_pnl: number;
  unsettled_interest: any;
};

export type TimeOpen = {
  hours: number;
  minutes: number;
  seconds: number;
};
