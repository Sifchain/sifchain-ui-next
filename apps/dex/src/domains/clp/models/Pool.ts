import { Decimal } from "@cosmjs/math";
import { calculateSwapWithFee } from "@sifchain/math";
import type { PoolRes } from "@sifchain/proto-types/sifnode/clp/v1/querier";
import BigNumber from "bignumber.js";

import { ROWAN } from "~/domains/assets";

export type ClpPool = Pick<
  NonNullable<PoolRes["pool"]>,
  | "nativeAssetBalance"
  | "externalAssetBalance"
  | "nativeCustody"
  | "externalCustody"
  | "nativeLiabilities"
  | "externalLiabilities"
>;

type PoolParams = {
  swapFeeRate?: string;
  currentRatioShiftingRate?: string;
  externalAssetDecimals?: number;
  isMarginEnabled?: boolean;
  nativeAssetDecimals?: number;
};

export default class Pool {
  public readonly nativeAssetBalance: BigNumber;
  public readonly externalAssetBalance: BigNumber;

  public readonly nativeLiabilities: BigNumber;
  public readonly externalLiabilities: BigNumber;

  public readonly nativeCustody: BigNumber;
  public readonly externalCustody: BigNumber;

  public readonly swapFeeRate: BigNumber;
  public readonly currentRatioShiftingRate: BigNumber;

  public readonly isMarginEnabled: boolean;

  public readonly nativeAssetDecimals: number;
  public readonly externalAssetDecimals: number;

  constructor(pool: ClpPool, params?: PoolParams) {
    this.nativeAssetBalance = BigNumber(pool.nativeAssetBalance);
    this.externalAssetBalance = BigNumber(pool.externalAssetBalance);

    this.nativeLiabilities = BigNumber(pool.nativeLiabilities);
    this.externalLiabilities = BigNumber(pool.externalLiabilities);

    this.nativeCustody = BigNumber(pool.nativeCustody);
    this.externalCustody = BigNumber(pool.externalCustody);

    const {
      swapFeeRate = "0",
      currentRatioShiftingRate = "0",
      externalAssetDecimals = 18,
      nativeAssetDecimals = 18,
      isMarginEnabled = false,
    } = params ?? {};

    this.nativeAssetDecimals = nativeAssetDecimals;
    this.externalAssetDecimals = externalAssetDecimals;

    this.swapFeeRate = BigNumber(swapFeeRate);
    this.currentRatioShiftingRate = BigNumber(currentRatioShiftingRate);

    this.isMarginEnabled = isMarginEnabled;
  }

  static of(pool: ClpPool, params?: PoolParams) {
    return new this(pool, params);
  }

  extractValues(inputDenom: string) {
    if (inputDenom === ROWAN.symbol) {
      return {
        Y: this.externalAssetBalance,
        X: this.nativeAssetBalance,
        toRowan: false,
      };
    }
    return {
      Y: this.nativeAssetBalance,
      X: this.externalAssetBalance,
      toRowan: true,
    };
  }

  extractDebt(X: BigNumber, Y: BigNumber, toRowan: boolean) {
    if (toRowan) {
      return {
        Y: Y.plus(this.nativeLiabilities),
        X: X.plus(this.externalLiabilities),
      };
    }
    return {
      X: X.plus(this.nativeLiabilities),
      Y: Y.plus(this.externalLiabilities),
    };
  }

  calculateSwapFromRowan(params: { inputAmount: string; inputDenom: string }) {
    let { X, Y, toRowan } = this.extractValues(params.inputDenom);

    if (this.isMarginEnabled) {
      const debt = this.extractDebt(X, Y, toRowan);
      X = debt.X;
      Y = debt.Y;
    }

    const x = Decimal.fromUserInput(params.inputAmount, this.nativeAssetDecimals);

    const swapParams = {
      inputAmount: x.atomics,
      inputBalanceInPool: X.toString(),
      outputBalanceInPool: Y.toString(),
      swapFeeRate: this.swapFeeRate.toString(),
      currentRatioShiftingRate: this.currentRatioShiftingRate.toString(),
    };

    return calculateSwapWithFee(swapParams, toRowan);
  }

  calculateSwapToRowan(params: { inputAmount: string; inputDenom: string }) {
    let { X, Y, toRowan } = this.extractValues(params.inputDenom);

    if (this.isMarginEnabled) {
      const debt = this.extractDebt(X, Y, toRowan);
      X = debt.X;
      Y = debt.Y;
    }

    const x = Decimal.fromUserInput(params.inputAmount, this.externalAssetDecimals);

    const swapParams = {
      inputAmount: x.atomics,
      inputBalanceInPool: X.toString(),
      outputBalanceInPool: Y.toString(),
      swapFeeRate: this.swapFeeRate.toString(),
      currentRatioShiftingRate: this.currentRatioShiftingRate.toString(),
    };

    return calculateSwapWithFee(swapParams, toRowan);
  }

  calculateSwap(params: { inputAmount: string; inputDenom: string }) {
    return params.inputDenom === ROWAN.symbol ? this.calculateSwapFromRowan(params) : this.calculateSwapToRowan(params);
  }

  calculateMarginPosition(params: { inputAmount: string; inputDenom: string; leverage: number }) {
    return this.calculateSwap({
      inputAmount: BigNumber(params.inputAmount).times(params.leverage).toString(),
      inputDenom: params.inputDenom,
    });
  }
}
