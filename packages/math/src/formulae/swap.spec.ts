import { calculatePmtpSwapResult, calculateSwapResult } from "./swap";

import BigNumber from "bignumber.js";
import swapResultFixture from "../../__fixtures__/single_swap_result.json";

describe("swap", () => {
  test.each(
    swapResultFixture.SingleSwapResult.map((x) => [x.x, x.X, x.Y, x.expected]),
  )("swapping %s for %s with balance %s returns %s", (x, X, Y, expected) => {
    const output = calculateSwapResult(x, X, Y);
    expect(output.toPrecision(18)).toEqual(
      new BigNumber(expected).toPrecision(18),
    );
  });
});

describe("swap with PMTP", () => {
  test.each(
    swapResultFixture.SingleSwapResult_pmtp.map((x) => [
      x.x,
      x.X,
      x.Y,
      x.A,
      x.expected,
    ]),
  )(
    "swapping %s for %s with balance %s and adjustment of %s returns %s",
    (x, X, Y, A, expected) => {
      const [$x, $X, $Y, $A] = [x, X, Y, A].map((x) => new BigNumber(x));
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const output = calculatePmtpSwapResult($x!, $X!, $Y!, $A!);

      expect(output.toPrecision(18)).toEqual(
        new BigNumber(expected).toPrecision(18),
      );
    },
  );
});
