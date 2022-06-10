import BigNumber from "bignumber.js";

/**
 * calculate slip adjustment based on formula 1 - ABS((R a - r A)/((2 r + R) (a + A)))
 * @param r native amount added
 * @param a external amount added
 * @param R native Balance (before)
 * @param A external Balance (before)
 * @returns slip adjustment
 */
export const slipAdjustment = (
  r: BigNumber.Value,
  a: BigNumber.Value,
  R: BigNumber.Value,
  A: BigNumber.Value,
) => {
  const _r = new BigNumber(r);
  const _a = new BigNumber(a);
  const _R = new BigNumber(R);

  const slipAdjDenominator = _r.plus(R).times(_a.plus(A));
  const slipAdjustmentReciprocal = _R.times(a).gt(_r.times(A))
    ? _R.times(a).minus(_r.times(A)).div(slipAdjDenominator)
    : _r.times(A).minus(_R.times(a)).div(slipAdjDenominator);

  return new BigNumber(1).minus(slipAdjustmentReciprocal);
};

/**
 * calculate Swap Result based on formula ( x * X * Y ) / ( x + X ) ^ 2
 * @param X external Balance
 * @param x swap Amount
 * @param Y native Balance
 * @returns swapAmount
 */
export const calculateSwapResult = (
  x: BigNumber.Value,
  X: BigNumber.Value,
  Y: BigNumber.Value,
) => {
  const _x = new BigNumber(x);
  const _X = new BigNumber(X);
  const _Y = new BigNumber(Y);

  if (_x.isZero() || _X.isZero() || _Y.isZero()) {
    return new BigNumber(0);
  }
  const xPlusX = _x.plus(X);
  return _x.times(X).times(Y).div(xPlusX.times(xPlusX));
};

/**
 * calculate Swap Result based on formula (( x * X * Y ) / ( x + X ) ^ 2) * (1 + adjustment / 100)
 * @param x swap Amount
 * @param X  external Balance
 * @param Y native Balance
 * @param adjustment PMTP purchasing power adjustment
 * @returns swapAmount
 */
export const calculatePmtpSwapResult = (
  x: BigNumber.Value,
  X: BigNumber.Value,
  Y: BigNumber.Value,
  adjustment: BigNumber.Value,
) => {
  const _x = new BigNumber(x);
  const _X = new BigNumber(X);
  const _Y = new BigNumber(Y);
  const _adjustment = new BigNumber(adjustment);

  if (_x.isZero() || _X.isZero() || _Y.isZero()) {
    return new BigNumber(0);
  }

  const adjustmentPercentage = _adjustment.div(100_000_000_000_000_000_000);

  return calculateSwapResult(x, X, Y).times(adjustmentPercentage.plus(1));
};

/**
 * formula: S = (x * X * Y) / (x + X) ^ 2
 * reverse Formula: x = ( -2*X*S + X*Y - X*sqrt( Y*(Y - 4*S) ) ) / 2*S
 * ok to accept a little precision loss as reverse swap amount can be rough
 * @param S
 * @param X
 * @param Y
 * @returns
 */
export const calculateReverseSwapResult = (
  S: BigNumber.Value,
  X: BigNumber.Value,
  Y: BigNumber.Value,
) => {
  const _S = new BigNumber(S);
  const _X = new BigNumber(X);
  const _Y = new BigNumber(Y);
  // Adding a check here because sqrt of a negative number will throw an exception
  if (_S.isZero() || _X.isZero() || _S.times(4).gt(Y)) {
    return new BigNumber(0);
  }
  const term1 = new BigNumber(-2).times(X).times(S);
  const term2 = _X.times(Y);
  const underRoot = _Y.times(_Y.minus(_S.times(4)));
  const term3 = _X.times(underRoot.sqrt());
  const numerator = term1.plus(term2).minus(term3);
  const denominator = _S.times(2);
  const x = numerator.div(denominator);

  return x.gte(0) ? x : new BigNumber(0);
};

/**
 * calculate Provider Fee according to the formula: ( x^2 * Y ) / ( x + X )^2
 * @param x swap Amount
 * @param X external Balance
 * @param Y native Balance
 * @returns providerFee
 */
export const calculateProviderFee = (
  x: BigNumber.Value,
  X: BigNumber.Value,
  Y: BigNumber.Value,
) => {
  const _x = new BigNumber(x);
  const _X = new BigNumber(X);
  const _Y = new BigNumber(Y);

  if (_x.isZero() || _X.isZero() || _Y.isZero()) {
    return new BigNumber(0);
  }

  const xPlusX = _x.plus(X);
  return _x.times(x).times(Y).div(xPlusX.times(xPlusX));
};

/**
 * calculate price impact according to the formula (x) / (x + X)
 * @param x swap Amount
 * @param X external Balance
 * @returns
 */
export const calculatePriceImpact = (
  x: BigNumber.Value,
  X: BigNumber.Value,
) => {
  const _x = new BigNumber(x);

  if (_x.isZero()) {
    return new BigNumber(0);
  }

  const denominator = _x.plus(X);
  return _x.div(denominator);
};
