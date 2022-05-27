import { calculateSwapResult } from "./formulae";
import { Amount } from "./Amount";

import tests from "../../test/test-tables/singleswap_result.json";
import { expect, test } from "vitest";

tests.SingleSwapResult.forEach(({ x, X, Y, expected }: any) => {
  test(`Swapping ${x}, expecting ${expected}`, () => {
    const output = calculateSwapResult(
      // External -> Native pool
      Amount(x), // Swap Amount
      Amount(X), // External Balance
      Amount(Y), // Native Balance
    );
    expect(output.toBigInt().toString()).toBe(expected);
  });
});
