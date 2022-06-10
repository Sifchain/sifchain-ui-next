import {
  calculatePmtpSwapResult,
  calculateReverseSwapResult,
  calculateSwapResult,
} from "./swap";

import BigNumber from "bignumber.js";
import pmtpSwapFixture from "../../__fixtures__/pmtp_swap.json";
import reverseSwapFixture from "../../__fixtures__/reverse_swap.json";
import swapFixture from "../../__fixtures__/swap.json";

describe("swap", () => {
  test.each(swapFixture.map((x) => [x.x, x.X, x.Y, x.expected]))(
    "swapping %s for %s with balance %s returns %s",
    (x, X, Y, expected) => {
      const output = calculateSwapResult(x, X, Y);
      expect(output.toPrecision(18)).toEqual(
        new BigNumber(expected).toPrecision(18),
      );
    },
  );
});

describe("swap with PMTP", () => {
  test.each(pmtpSwapFixture.map((x) => [x.x, x.X, x.Y, x.A, x.expected]))(
    "swapping %s for %s with balance %s and adjustment of %s returns %s",
    (x, X, Y, A, expected) => {
      const output = calculatePmtpSwapResult(x, X, Y, A);
      expect(output.toPrecision(18)).toEqual(
        new BigNumber(expected).toPrecision(18),
      );
    },
  );
});

describe("reverse swap", () => {
  test.each(reverseSwapFixture.map((x) => [x.S, x.X, x.Y, x.expected]))(
    "reverse swapping %s for %s with balance %s returns %s",
    (S, X, Y, expected) => {
      const x = calculateReverseSwapResult(S, X, Y);
      expect(x.toPrecision(18)).toBe(new BigNumber(expected).toPrecision(18));
    },
  );
});
