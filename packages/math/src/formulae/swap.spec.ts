import { describe, expect, test } from "vitest";

import SWAP_FROM_ROWAN_CASES from "../../__fixtures__/swap_from_rowan.json";
import SWAP_TO_ROWAN_CASES from "../../__fixtures__/swap_to_rowan.json";
import {
  calculateSwapFeeFromRowan,
  calculateSwapFeeToRowan,
  calculateSwapFromRowan,
  calculateSwapToRowan,
} from "./swap";
import { parseSwapParams, parseSwapTestCase } from "./test-utils";

describe("Swap", () => {
  describe("from ROWAN", () => {
    test.each(SWAP_FROM_ROWAN_CASES.map(parseSwapTestCase))(
      "swapping %s with pool balances of %s/%s and fee rate of %s",
      (x, X, Y, f, r, expectedSwap, expectedFee) => {
        const { params, expected } = parseSwapParams({
          x,
          X,
          Y,
          f,
          r,
          expectedSwap,
          expectedFee,
        });
        const swapOutput = calculateSwapFromRowan(params);
        const feeOutput = calculateSwapFeeFromRowan(params);

        expect(swapOutput.toPrecision(18)).toEqual(expected.swap.toPrecision(18));
        expect(feeOutput.toPrecision(18)).toEqual(expected.fee.toPrecision(18));
      },
    );
  });

  describe("to ROWAN", () => {
    test.each(SWAP_TO_ROWAN_CASES.map(parseSwapTestCase))(
      "swapping %s with pool balances of %s/%s and fee rate of %s",
      (x, X, Y, f, r, expectedSwap, expectedFee) => {
        const { params, expected } = parseSwapParams({
          x,
          X,
          Y,
          f,
          r,
          expectedSwap,
          expectedFee,
        });
        const swapOutput = calculateSwapToRowan(params);
        const feeOutput = calculateSwapFeeToRowan(params);

        expect(swapOutput.toPrecision(18)).toEqual(expected.swap.toPrecision(18));

        expect(feeOutput.toPrecision(18)).toEqual(expected.fee.toPrecision(18));
      },
    );
  });
});
