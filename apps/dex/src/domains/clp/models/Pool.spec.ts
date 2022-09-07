import { Decimal } from "@cosmjs/math";
import { describe, expect, test } from "vitest";

import Pool, { ClpPool } from "./Pool";

describe("Pool", () => {
  test("Pool.calculateSwap", () => {
    const clpPool: ClpPool = {
      nativeAssetBalance: "25376502640463973675056097",
      externalAssetBalance: "239886340170361253659915",
      nativeCustody: "27162712481134561108458",
      externalCustody: "0",
      nativeLiabilities: "0",
      externalLiabilities: "225000000000000000000",
    };
    const subject = new Pool(clpPool, {
      swapFeeRate: "0",
      currentRatioShiftingRate: "0",
      externalAssetDecimals: 18,
      nativeAssetDecimals: 18,
      isMarginEnabled: true,
    });

    const result = subject.calculateMarginPosition({
      inputAmount: "1000",
      inputDenom: "cfrax",
      leverage: 10,
    });

    const rawSwapResult = result.swap.integerValue().toFixed(0);

    const asParsedNumber = Decimal.fromAtomics(rawSwapResult, 18).toString();

    expect(asParsedNumber).toBe("1015521.801758488156991732");
  });
});
