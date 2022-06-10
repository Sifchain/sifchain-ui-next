import { calculateSwapResult } from "./swap";

import BigNumber from "bignumber.js";
import fixture from "../../__fixtures__/single_swap_result.json";

test.each(
  fixture.SingleSwapResult_pmtp.map((x) => [x.x, x.X, x.Y, x.A, x.expected]),
)("swapping %i for %i returns %i", (x, X, Y, A, expected) => {
  const [$x, $X, $Y, $A] = [x, X, Y, A].map((x) => new BigNumber(x));
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const output = calculateSwapResult($x!, $X!, $Y!, $A!);

  expect(output.toPrecision(18)).toEqual(
    new BigNumber(expected).toPrecision(18),
  );
});
