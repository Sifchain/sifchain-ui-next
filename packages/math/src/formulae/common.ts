import BigNumber from "bignumber.js";

/**
 * calculate slip adjustment based on formula 1 - ABS((R a - r A)/((2 r + R) (a + A)))
 * @param leftAmount
 * @param rightAmount
 * @param leftPoolAmount
 * @param rightPoolAmount
 * @returns slip adjustment
 */
export const calculateSlipAdjustment = (
  leftAmount: BigNumber.Value,
  rightAmount: BigNumber.Value,
  leftPoolAmount: BigNumber.Value,
  rightPoolAmount: BigNumber.Value,
) => {
  const l = new BigNumber(leftAmount);
  const r = new BigNumber(rightAmount);
  const lp = new BigNumber(leftPoolAmount);
  const rp = new BigNumber(rightPoolAmount);

  const slipAdjDenominator = l.plus(lp).times(r.plus(rp));
  const slipAdjustmentReciprocal = lp.times(r).gt(l.times(rp))
    ? lp.times(r).minus(l.times(rp)).div(slipAdjDenominator)
    : l.times(rp).minus(lp.times(r)).div(slipAdjDenominator);

  return new BigNumber(1).minus(slipAdjustmentReciprocal);
};
