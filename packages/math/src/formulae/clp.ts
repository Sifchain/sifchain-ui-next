import BigNumber from "bignumber.js";
import { calculateSlipAdjustment } from "./common";

export const calculatePoolUnits = (
  nativeAmount: BigNumber.Value,
  externalAmount: BigNumber.Value,
  pooledNativeAmount: BigNumber.Value,
  pooledExternalAmount: BigNumber.Value,
  poolUnits: BigNumber.Value,
) => {
  const na = new BigNumber(nativeAmount);
  const ea = new BigNumber(externalAmount);
  const pna = new BigNumber(pooledNativeAmount);
  const pea = new BigNumber(pooledExternalAmount);
  const pu = new BigNumber(poolUnits);

  if (pea.isZero() || pna.isZero() || pu.isZero()) {
    return new BigNumber(nativeAmount);
  }

  if (ea.isZero() && na.isZero()) {
    return new BigNumber(0);
  }

  const slipAdjustmentCalc = calculateSlipAdjustment(
    nativeAmount,
    externalAmount,
    pooledNativeAmount,
    pooledExternalAmount,
  );

  // ((P (a R + A r))
  const numerator = pu.times(
    ea.times(pooledNativeAmount).plus(new BigNumber(pooledExternalAmount).times(nativeAmount)),
  );
  const denominator = new BigNumber(2).times(pooledExternalAmount).times(pooledNativeAmount);

  return numerator.div(denominator).times(slipAdjustmentCalc);
};
