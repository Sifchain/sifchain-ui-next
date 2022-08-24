import BigNumber from "bignumber.js";
import { test, describe, expect } from "vitest";

import SWAP_TO_ROWAN_CASES from "../../__fixtures__/swap_to_rowan.json";
import SWAP_FROM_ROWAN_CASES from "../../__fixtures__/swap_from_rowan.json";

import { calculateSwapToRowan } from "./swap";

export type SwapTestCase = {
  x: string;
  X: string;
  Y: string;
  f: string;
  r: string;
  expected: string;
};

export const parseSwapParams = (params: SwapTestCase) => ({
  params: {
    inputAmount: BigNumber(String(params["x"])),
    inputBalanceInPool: BigNumber(String(params["X"])),
    outputBalanceInPool: BigNumber(String(params["Y"])),
    swapFeeRate: BigNumber(String(params["f"])),
    currentRatioShiftingRate: BigNumber(String(params["r"])),
  },
  expected: BigNumber(String(params["expected"])),
});

describe("Swap", () => {
  describe("to ROWAN", () => {
    test.each(SWAP_TO_ROWAN_CASES.map(parseSwapParams))(
      "swapping %s for %s with balance %s has price impact of %s",
      ({ params, expected }) => {
        const output = calculateSwapToRowan(params);

        expect(output.toPrecision(18)).toEqual(expected.toPrecision(18));
      },
    );
  });

  describe("from ROWAN", () => {
    test.each(SWAP_FROM_ROWAN_CASES.map(parseSwapParams))(
      "swapping %s for %s with balance %s has price impact of %s",
      ({ params, expected }) => {
        const output = calculateSwapToRowan(params);

        expect(output.toPrecision(18)).toEqual(expected.toPrecision(18));
      },
    );
  });
});
