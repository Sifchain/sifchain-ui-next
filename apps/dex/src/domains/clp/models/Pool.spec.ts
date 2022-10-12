import { Decimal } from "@cosmjs/math";
import { describe, expect, test } from "vitest";

import Pool, { ClpPool } from "./Pool";

describe("Pool", () => {
  test("Pool.calculateSwap (without debt)", () => {
    const clpPool: ClpPool = {
      externalAssetBalance: "223627769304929615665586",
      externalCustody: "0",
      externalLiabilities: "0",
      nativeAssetBalance: "17712820676298900101979950",
      nativeCustody: "0",
      nativeLiabilities: "0",
    };
    const subject = new Pool(clpPool, {
      swapFeeRate: "0",
      currentRatioShiftingRate: "0",
      externalAssetDecimals: 18,
      nativeAssetDecimals: 18,
      isMarginEnabled: true,
    });

    const result = subject.calculateMarginPosition({
      inputAmount: "100",
      inputDenom: "cfrax",
      leverage: 10,
    });

    const rawSwapResult = result.swap.integerValue().toFixed(0);

    const parsedResult = Decimal.fromAtomics(rawSwapResult, 18).toString();

    expect(parsedResult).toBe("78854.10041290998874416");
  });

  test("Pool.calculateSwap (with debt)", () => {
    const clpPool: ClpPool = {
      externalAssetBalance: "223627769304929615665586",
      externalCustody: "119734183541432446641",
      externalLiabilities: "47790000000000000000000",
      nativeAssetBalance: "17712820676298900101979950",
      nativeCustody: "4788428148225123308494665",
      nativeLiabilities: "9000000000000000000000",
    };
    const subject = new Pool(clpPool, {
      swapFeeRate: "0",
      currentRatioShiftingRate: "0",
      externalAssetDecimals: 18,
      nativeAssetDecimals: 18,
      isMarginEnabled: true,
    });

    const result = subject.calculateMarginPosition({
      inputAmount: "100",
      inputDenom: "cfrax",
      leverage: 10,
    });

    const rawSwapResult = result.swap.integerValue().toFixed(0);

    const parsedResult = Decimal.fromAtomics(rawSwapResult, subject.nativeAssetDecimals).toString();

    expect(parsedResult).toBe("65053.835223436027514509");
  });

  test("Pool.calculateSwap (closing position)", () => {
    const clpPool: ClpPool = {
      externalAssetBalance: "220437513213389332316853",
      externalCustody: "0",
      externalLiabilities: "18000000000000000000000",
      nativeAssetBalance: "20590337086364220470975096",
      nativeCustody: "1924035956399503621747548",
      nativeLiabilities: "0",
    };

    const subject = new Pool(clpPool, {
      swapFeeRate: "0",
      currentRatioShiftingRate: "0",
      externalAssetDecimals: 18,
      nativeAssetDecimals: 18,
      isMarginEnabled: true,
    });

    const result = subject.calculateMarginPosition({
      inputAmount: "982623.37",
      inputDenom: "rowan",
      leverage: 1,
    });

    const rawSwapResult = result.swap.integerValue().toFixed(0);

    const parsedResult = Decimal.fromAtomics(rawSwapResult, 18).toString();

    expect(parsedResult).toBe("10860.552646080672871532");
  });
});
