import {
  pmtpSwapResult,
  priceImpact,
  providerFee,
  swapAmountNeeded,
  swapResult,
} from "./swap";

import BigNumber from "bignumber.js";
import pmtpSwapFixture from "../../__fixtures__/pmtp_swap.json";
import priceImpactFixture from "../../__fixtures__/price_impact.json";
import providerFeesFixture from "../../__fixtures__/provider_fees.json";
import reverseSwapFixture from "../../__fixtures__/reverse_swap.json";
import swapFixture from "../../__fixtures__/swap.json";

describe("swap", () => {
  test.each(swapFixture.map((x) => [x.x, x.X, x.Y, x.expected]))(
    "swapping %s with pool balances of %s/%s returns %s",
    (fromAmount, fromCoinPoolAmount, toCoinPoolAmount, expected) => {
      const output = swapResult(
        fromAmount,
        fromCoinPoolAmount,
        toCoinPoolAmount,
      );
      expect(output.toPrecision(18)).toEqual(
        new BigNumber(expected).toPrecision(18),
      );
    },
  );
});

describe("swap with PMTP", () => {
  test.each(pmtpSwapFixture.map((x) => [x.x, x.X, x.Y, x.A, x.expected]))(
    "swapping %s with pool balances of %s/%s and adjustment of %s returns %s",
    (
      fromAmount,
      fromCoinPoolAmount,
      toCoinPoolAmount,
      adjustment,
      expected,
    ) => {
      const output = pmtpSwapResult(
        fromAmount,
        fromCoinPoolAmount,
        toCoinPoolAmount,
        adjustment,
      );
      expect(output.toPrecision(18)).toEqual(
        new BigNumber(expected).toPrecision(18),
      );
    },
  );
});

describe("reverse swap", () => {
  test.each(reverseSwapFixture.map((x) => [x.S, x.X, x.Y, x.expected]))(
    "to get %s with target pool of %s & from pool of %s, %s is needed",
    (S, X, Y, expected) => {
      const x = swapAmountNeeded(S, X, Y);
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
      const output = providerFee(x, X, Y);
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
      const output = priceImpact(x, X);
      return expect(output.toPrecision(18)).toEqual(
        new BigNumber(expected).toPrecision(18),
      );
    },
  );
});
