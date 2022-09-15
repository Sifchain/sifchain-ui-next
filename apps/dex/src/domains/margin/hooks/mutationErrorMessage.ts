export const ACCOUNT_NOT_APPROVED_FOR_TRADING = "Your account has not yet been approved for margin trading.";
export const ACCOUNT_NOT_ENOUGH_BALANCE = "You dont have enough balance of the required coin.";
export const ACCOUNT_NOT_IN_SIFCHAIN =
  "Insufficient funds. Please import assets onto Sifchain in order to proceed with trading.";

export const DEFAULT_ERROR_CLOSE_POSITION = "Failed to close margin position. Try again later.";
export const DEFAULT_ERROR_OPEN_POSITION = "Failed to open margin position. Try again later.";

export const POOL_MAX_OPEN_POSITIONS_REACHED =
  "The selected pool has reached it's limit for open margin positions. Please try again later.";
export const POOL_TRADE_TEMPORARILY_DISABLED = "Margin trading is temporarily disabled for this pool.";

export const MTP_NOT_FOUND = "Unable to close the trade position. Trade ID not found.";
export const MTP_LOW_BORROWED_AMOUNT =
  "Sorry, the borrowed amount is too small. Try opening a position with higher leverage.";
export const MTP_BORROWED_HIGHER_THAN_POOL_DEPTH =
  "Position cannot be opened. The borrow amount is larger than the available liquidity in the pool. Please try again.";

// https://github.com/Sifchain/sifnode/blob/master/x/margin/types/errors.go
export const SIFNODE_ERRORS = {
  MTP_NOT_FOUND: "mtp not found",
  MTP_INVALID: "mtp invalid",
  MARGIN_NOT_ENABLED_FOR_POOL: "margin not enabled for pool",
  UNKNOWN_REQUEST: "unknown request",
  MTP_HEALTH_ABOVE_FORCE_CLOSE_THRESHOLD: "mtp health above force close threshold",
  MTP_POSITION_INVALID: "mtp position invalid",
  MAX_OPEN_POSITIONS_REACHED: "max open positions reached",
  ADDRESS_NOT_ON_WHITELIST: "address not on whitelist",
  BORROWED_AMOUNT_IS_TOO_LOW: "borrowed amount is too low",
  BORROWED_AMOUNT_IS_HIGHER_THAN_POOL_DEPTH: "borrowed amount is higher than pool depth",
  CUSTODY_AMOUNT_IS_HIGHER_THAN_POOL_DEPTH: "custody amount is higher than pool depth",
  MTP_HEALTH_WOULD_BE_TOO_LOW_FOR_SAFETY_FACTOR: "mtp health would be too low for safety factor",
};
