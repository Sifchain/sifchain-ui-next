import { Decimal } from "@cosmjs/math";
import { calculateSwapWithFee } from "@sifchain/math";
import type { PoolRes } from "@sifchain/proto-types/sifnode/clp/v1/querier";
import BigNumber from "bignumber.js";

export type ClpPool = Pick<
  NonNullable<PoolRes["pool"]>,
  | "nativeAssetBalance"
  | "externalAssetBalance"
  | "nativeCustody"
  | "externalCustody"
  | "nativeLiabilities"
  | "externalLiabilities"
>;

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

  constructor(
    pool: ClpPool,
    params: {
      swapFeeRate: string;
      currentRatioShiftingRate: string;
      externalAssetDecimals: number;
      isMarginEnabled: boolean;
      nativeAssetDecimals?: number;
    },
  ) {
    const { swapFeeRate, currentRatioShiftingRate, externalAssetDecimals, nativeAssetDecimals = 18 } = params;

    this.nativeAssetDecimals = nativeAssetDecimals;
    this.externalAssetDecimals = externalAssetDecimals;

    this.nativeAssetBalance = BigNumber(pool.nativeAssetBalance);
    this.externalAssetBalance = BigNumber(pool.externalAssetBalance);

    this.nativeLiabilities = BigNumber(pool.nativeLiabilities);
    this.externalLiabilities = BigNumber(pool.externalLiabilities);

    this.nativeCustody = BigNumber(pool.nativeCustody);
    this.externalCustody = BigNumber(pool.externalCustody);

    this.swapFeeRate = BigNumber(swapFeeRate);
    this.currentRatioShiftingRate = BigNumber(currentRatioShiftingRate);

    this.isMarginEnabled = params.isMarginEnabled;
  }

  extractValues(inputDenom: string) {
    if (inputDenom === "rowan") {
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
        Y: Y.plus(this.nativeCustody).plus(this.nativeLiabilities),
        X: X.plus(this.externalCustody).plus(this.externalLiabilities),
      };
    }
    return {
      X: X.plus(this.nativeCustody).plus(this.nativeLiabilities),
      Y: Y.plus(this.externalCustody).plus(this.externalLiabilities),
    };
  }

  calculateSwapFromRowan(params: { inputAmount: string; inputDenom: string }) {
    let { X, Y, toRowan } = this.extractValues(params.inputDenom);

    if (this.isMarginEnabled) {
      const debt = this.extractDebt(X, Y, toRowan);
      X = debt.X;
      Y = debt.Y;
    }

    let x = Decimal.fromUserInput(params.inputAmount, this.nativeAssetDecimals);

    return calculateSwapWithFee(
      {
        inputAmount: x.atomics,
        inputBalanceInPool: X.toString(),
        outputBalanceInPool: Y.toString(),
        swapFeeRate: this.swapFeeRate.toString(),
        currentRatioShiftingRate: this.currentRatioShiftingRate.toString(),
      },
      toRowan,
    );
  }

  calculateSwapToRowan(params: { inputAmount: string; inputDenom: string }) {
    let x = Decimal.fromUserInput(params.inputAmount, this.externalAssetDecimals);

    let { X, Y, toRowan } = this.extractValues(params.inputDenom);

    if (this.isMarginEnabled) {
      const debt = this.extractDebt(X, Y, toRowan);
      console.log("debt", { debt, X, Y, toRowan });
      X = debt.X;
      Y = debt.Y;
    }

    return calculateSwapWithFee(
      {
        inputAmount: x.atomics,
        inputBalanceInPool: X.toString(),
        outputBalanceInPool: Y.toString(),
        swapFeeRate: this.swapFeeRate.toString(),
        currentRatioShiftingRate: this.currentRatioShiftingRate.toString(),
      },
      toRowan,
    );
  }

  calculateSwap(params: { inputAmount: string; inputDenom: string }) {
    return params.inputDenom === "rowan" ? this.calculateSwapFromRowan(params) : this.calculateSwapToRowan(params);
  }

  calculateMarginPosition(params: { inputAmount: string; inputDenom: string; leverage: number }) {
    return this.calculateSwap({
      inputAmount: BigNumber(params.inputAmount).times(params.leverage).toString(),
      inputDenom: params.inputDenom,
    });
  }
}
