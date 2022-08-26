export type Pagination = {
  total: string;
  limit: string;
  offset: string;
  order_by: string;
  sort_by: string;
};

export type OpenPositionsQueryData = {
  address: string;
  date_opened: string;
  pool: string;
  custody_amount: string;
  custody_asset: string;
  leverage: string;
  unrealized_pnl: string;
  interest_rate: string;
  current_interest_paid_custody: number;
  health: string;
  current_custody_amount: string;
  current_price: string;
  collateral_amount: string;
  collateral_asset: string;
  time_open: TimeOpen;
  id: string;
  liabilities: string;
  interest_paid_custody: string;
  interest_unpaid_collateral: string;
  interest_paid_collateral: string;
  custody_entry_price: string;
  current_interest_paid_collateral: string;
  current_interest_unpaid_collateral: string;
  mtp_open_execution_price: string;
  next_payment: any;
  position: string;
  repay_amount: string;
  unrealized_pnl_formula: string;
  currentCustodyAmount: string;
  currentPrice: string;
  openCustodyAmount: string;
  openPrice: string;
};

export type TimeOpen = {
  hours: number;
  minutes: number;
  seconds: number;
};

export interface HistoryQueryData {
  address: string;
  id: string;
  pool: string;
  open_custody_amount: string;
  open_custody_asset: string;
  open_collateral_amount: string;
  open_collateral_asset: string;
  open_date_time: string;
  closed_date_time: string;
  open_health: string;
  open_leverage: string;
  position: string;
  realized_pnl: string;
  realized_pnl_formula: string;
  repayAmount: string;
  openCollateralAmount: string;
  openLiabilities: string;
  type: string;
  open_liabilities: string;
  close_liabilities: string;
  mtp_close_custody_amount: string;
  mtp_close_execution_price: string;
  mtp_open_custody_amount: string;
  mtp_open_execution_price: string;
}

export interface EventCoinReceived {
  type: "coin_received";
  attributes: [
    {
      key: "receiver";
      value: string;
    },
    {
      key: "amount";
      value: string;
    },
  ];
}

export interface EventCoinSpent {
  type: "coin_spent";
  attributes: [
    {
      key: "spender";
      value: string;
    },
    {
      key: "amount";
      value: string;
    },
  ];
}

export interface EventMarginMtpClose {
  type: "margin/mtp_close";
  attributes: [
    { key: "id"; value: string },
    { key: "position"; value: string },
    { key: "address"; value: string },
    { key: "collateral_asset"; value: string },
    { key: "collateral_amount"; value: string },
    { key: "custody_asset"; value: string },
    { key: "custody_amount"; value: string },
    { key: "repay_amount"; value: string },
    { key: "leverage"; value: string },
    { key: "liabilities"; value: string },
    { key: "interest_paid_collateral"; value: string },
    { key: "interest_paid_custody"; value: string },
    { key: "interest_unpaid_collateral"; value: string },
    { key: "health"; value: string },
  ];
}

export interface EventMarginMtpOpen {
  type: "margin/mtp_open";
  attributes: [
    { key: "id"; value: string },
    { key: "position"; value: string },
    { key: "address"; value: string },
    { key: "collateral_asset"; value: string },
    { key: "collateral_amount"; value: string },
    { key: "custody_asset"; value: string },
    { key: "custody_amount"; value: string },
    { key: "leverage"; value: string },
    { key: "liabilities"; value: string },
    { key: "interest_paid_collateral"; value: string },
    { key: "interest_paid_custody"; value: string },
    { key: "interest_unpaid_collateral"; value: string },
    { key: "health"; value: string },
  ];
}

export interface EventMessage {
  type: "message";
  attributes: [
    { key: "action"; value: string },
    {
      key: "sender";
      value: string;
    },
  ];
}

export interface EventTransfer {
  type: "transfer";
  attributes: [
    {
      key: "recipient";
      value: string;
    },
    {
      key: "sender";
      value: string;
    },
    { key: "amount"; value: string },
  ];
}

export type MTPOpenResponse = [
  {
    events: [EventCoinReceived, EventCoinSpent, EventMarginMtpOpen, EventMessage, EventTransfer];
  },
];

export type MTPCloseResponse = [
  {
    events: [EventCoinReceived, EventCoinSpent, EventMarginMtpClose, EventMessage, EventTransfer];
  },
];
