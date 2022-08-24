/**
 * @TODO update the link once it's merged
 *
 *  Implements the spec for `Fixed Rate Swap Fees`
 *
 * - proposal - https://github.com/Sifchain/sifnode/blob/feature/swap_formula/docs/proposals/fixed_rate_swap_fees.md
 * - tutorial - https://github.com/Sifchain/sifnode/blob/feature/swap_formula/docs/tutorials/swap-fee-rate.md
 *
 */

import BigNumber from "bignumber.js";

const ONE = BigNumber(1);

export type SwapParams = {
  /**
   * amount to be swapped from
   */
  inputAmount: BigNumber.Value;
  /**
   * amount of input asset in the pool
   */
  inputBalanceInPool: BigNumber.Value;
  /**
   * amount of output asset in the pool
   */
  outputBalanceInPool: BigNumber.Value;
  /**
   * current swap fee rate (sifnode gov param)
   */
  swapFeeRate: BigNumber.Value;
  /**
   * current PMTP ratio shifting rate
   */
  currentRatioShiftingRate: BigNumber.Value;
};

/**
 * Calculate Swap Amount from ROWAN to EXTERNAL ASSET based on formula:
 * - (1 - f) * (1 + r) * x * Y / (x + X)
 *
 * where:
 * - f is the swap fee rate
 * - x is the input amount
 * - X is the balance of input token in the pool
 * - Y is the balance of output token in the pool
 * - r is the interest rate
 *
 * @param params {SwapParams} - swap parameters
 *
 * @returns amount obtained from swap
 *
 * @example
 *
 * const inputAmount = BigNumber(200000000000000);
 * const inputBalanceInPool = BigNumber(1999800619938006200);
 * const outputBalanceInPool = BigNumber(2000200000000000000);
 * const swapFeeRate = BigNumber(0.003);
 * const currentRatioShiftingRate = BigNumber(0);
 *
 * calculateSwapFromRowan({
 *  inputAmount,
 *  inputBalanceInPool,
 *  outputBalanceInPool,
 *  swapFeeRate,
 *  currentRatioShiftingRate
 * });
 */
export function calculateSwapFromRowan({
  inputAmount,
  inputBalanceInPool,
  outputBalanceInPool,
  swapFeeRate,
  currentRatioShiftingRate,
}: SwapParams) {
  const f = BigNumber(swapFeeRate);
  const r = BigNumber(currentRatioShiftingRate);
  const x = BigNumber(inputAmount);
  const X = BigNumber(inputBalanceInPool);
  const Y = BigNumber(outputBalanceInPool);

  // consider the formula:
  // (1 - f) * (1 + r) * x * Y / (x + X)
  const term1 = ONE.minus(f); // (1 - f)
  const term2 = ONE.plus(r); // (1 + r)
  const term3 = x.times(Y); // x * Y
  const term4 = x.plus(X); // (x + X)

  return term1.times(term2).times(term3).div(term4);
}

/**
 * Calculate Swap Fee from ROWAN to EXTERNAL ASSET based on formula:
 * - f * (1 + r) * x * Y / (x + X)
 *
 * where:
 * - f is the swap fee rate
 * - x is the input amount
 * - X is the balance of input token in the pool
 * - Y is the balance of output token in the pool
 * - r is the current ratio shifting running rate
 *
 * @param params {SwapParams} - swap parameters
 *
 * @returns swap fee amount
 *
 * @example
 *
 * const inputAmount = BigNumber(200000000000000);
 * const inputBalanceInPool = BigNumber(1999800619938006200);
 * const outputBalanceInPool = BigNumber(2000200000000000000);
 * const swapFeeRate = BigNumber(0.003);
 * const currentRatioShiftingRate = BigNumber(0);
 *
 * calculateSwapFeeFromRowan({
 *  inputAmount,
 *  inputBalanceInPool,
 *  outputBalanceInPool,
 *  swapFeeRate,
 *  currentRatioShiftingRate
 * });
 */
export function calculateSwapFeeFromRowan({
  inputAmount,
  inputBalanceInPool,
  outputBalanceInPool,
  swapFeeRate,
  currentRatioShiftingRate,
}: SwapParams) {
  const f = BigNumber(swapFeeRate);
  const r = BigNumber(currentRatioShiftingRate);
  const x = BigNumber(inputAmount);
  const X = BigNumber(inputBalanceInPool);
  const Y = BigNumber(outputBalanceInPool);

  // consider the formula:
  // f * (1 + r) * x * Y / (x + X)
  const term1 = f.times(ONE.plus(r)); // f * (1 + r)
  const term2 = x.times(Y); // x * Y
  const term3 = x.plus(X); // (x + X)

  return term1.times(term2).div(term3);
}

/**
 * Calculate Swap Amount from EXTERNAL ASSET to ROWAN based on formula:
 * - (1 - f) * x * Y / ((x + X)(1 + r))
 *
 * where:
 * - f is the swap fee rate
 * - x is the input amount
 * - X is the balance of input token in the pool
 * - Y is the balance of output token in the pool
 * - r is the current ratio shifting running rate
 *
 * @param params {SwapParams} - swap parameters
 *
 * @returns amount obtained from swap
 *
 * @example
 *
 * const inputAmount = BigNumber(200000000000000);
 * const inputBalanceInPool = BigNumber(1999800619938006200);
 * const outputBalanceInPool = BigNumber(2000200000000000000);
 * const swapFeeRate = BigNumber(0.003);
 * const currentRatioShiftingRate = BigNumber(0);
 *
 * calculateSwapToRowan({
 *  inputAmount,
 *  inputBalanceInPool,
 *  outputBalanceInPool,
 *  swapFeeRate,
 *  currentRatioShiftingRate
 * });
 */
export function calculateSwapToRowan({
  inputAmount,
  inputBalanceInPool,
  outputBalanceInPool,
  swapFeeRate,
  currentRatioShiftingRate,
}: SwapParams) {
  const f = BigNumber(swapFeeRate);
  const r = BigNumber(currentRatioShiftingRate);
  const x = BigNumber(inputAmount);
  const X = BigNumber(inputBalanceInPool);
  const Y = BigNumber(outputBalanceInPool);

  // consider the formula:
  // (1 - f) * x * Y / ((x + X)(1 + r))
  const term1 = ONE.minus(f); // (1 - f)
  const term2 = x.times(Y); // x * Y
  const term3 = x.plus(X); // (x + X)
  const term4 = ONE.plus(r); // (1 + r)

  return term1.times(term2).div(term3.times(term4));
}

/**
 * Calculate Swap Fee from EXTERNAL ASSET to ROWAN based on formula:
 * - f * x * Y / ((x + X)(1 + r))
 *
 * where:
 * - f is the swap fee rate
 * - x is the input amount
 * - X is the balance of input token in the pool
 * - Y is the balance of output token in the pool
 * - r is the current ratio shifting running rate
 *
 * @param params {SwapParams} - swap parameters
 *
 * @returns swap fee amount
 *
 * @example
 *
 * const inputAmount = BigNumber(200000000000000);
 * const inputBalanceInPool = BigNumber(1999800619938006200);
 * const outputBalanceInPool = BigNumber(2000200000000000000);
 * const swapFeeRate = BigNumber(0.003);
 * const currentRatioShiftingRate = BigNumber(0);
 *
 * calculateSwapFeeToRowan({
 *  inputAmount,
 *  inputBalanceInPool,
 *  outputBalanceInPool,
 *  swapFeeRate,
 *  currentRatioShiftingRate
 * });
 */
export function calculateSwapFeeToRowan({
  inputAmount,
  inputBalanceInPool,
  outputBalanceInPool,
  swapFeeRate,
  currentRatioShiftingRate,
}: SwapParams) {
  const f = BigNumber(swapFeeRate);
  const r = BigNumber(currentRatioShiftingRate);
  const x = BigNumber(inputAmount);
  const X = BigNumber(inputBalanceInPool);
  const Y = BigNumber(outputBalanceInPool);

  // consider the formula:
  // f * x * Y / ((x + X)(1 + r))
  const term1 = f.times(x).times(Y); // f * x * Y
  const term2 = x.plus(X); // (x + X)
  const term3 = ONE.plus(r); // (1 + r)

  return term1.div(term2.times(term3));
}

export function calculateSwap(params: SwapParams, toRowan: boolean) {
  const fn = toRowan ? calculateSwapToRowan : calculateSwapFromRowan;

  return fn(params);
}

export function calculateSwapFee(params: SwapParams, toRowan: boolean) {
  const fn = toRowan ? calculateSwapFeeToRowan : calculateSwapFeeFromRowan;

  return fn(params);
}

export function calculateSwapWithFee(params: SwapParams, toRowan: boolean) {
  return {
    swap: calculateSwap(params, toRowan),
    fee: calculateSwapFee(params, toRowan),
  };
}
