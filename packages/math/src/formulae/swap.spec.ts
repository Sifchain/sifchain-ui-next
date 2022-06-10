import {
  calculatePmtpSwapResult,
  calculatePriceImpact,
  calculateProviderFee,
  calculateReverseSwapResult,
  calculateSwapResult,
} from "./swap";

import BigNumber from "bignumber.js";
import pmtpSwapFixture from "../../__fixtures__/pmtp_swap.json";
import priceImpactFixture from "../../__fixtures__/price_impact.json";
import providerFeesFixture from "../../__fixtures__/provider_fees.json";
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
      expect(x.toPrecision(18)).toEqual(
        new BigNumber(expected).toPrecision(18),
      );
    },
  );
});

describe("provider's fee", () => {
  test.each(providerFeesFixture.map((x) => [x.x, x.X, x.Y, x.expected]))(
    "swapping %s for %s with balance %s costs %s in provider's fee",
    (x, X, Y, expected) => {
      const output = calculateProviderFee(x, X, Y);
      expect(output.toPrecision(18)).toEqual(
        new BigNumber(expected).toPrecision(18),
      );
    },
  );
});

describe("price impact", () => {
  test.each(priceImpactFixture.map((x) => [x.x, x.X, x.expected]))(
    "swapping %s for %s with balance %s has price impact of %s",
    (x, X, expected) => {
      const output = calculatePriceImpact(x, X);
      return expect(output.toPrecision(18)).toEqual(
        new BigNumber(expected).toPrecision(18),
      );
    },
  );
});
