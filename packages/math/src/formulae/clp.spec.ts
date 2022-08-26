import { describe, expect, test } from "vitest";
import BigNumber from "bignumber.js";

import poolUnitsFixture from "../../__fixtures__/pool_units.json";
import { calculatePoolUnits } from "./clp";

// The following copies how the backend tests against rounding
// Backend appears to loose precision and the increase precision to avoid panic errors. Our Fraction system appears to avoid this by using integer Fractions to store values
// This sidesteps the issue though as it might be possible for us to run into trouble if numerators or denominator get too big
// See https://github.com/Sifchain/sifnode/blob/b4a18903319ba3dd5349deb4d6182140e720b163/x/clp/keeper/table_test.go#L14
const BUFFER_PERCENTAGE = 0.0121; // Percentage difference allowable to accommodate rounding done by Big libraries in Go,Python and Javascript

describe("pool units", () => {
  test.each(poolUnitsFixture.map((x) => [x.r, x.a, x.R, x.A, x.P, x.expected]))(
    "adding %s/%s to pool of balance of %s/%s/%s will gains %s units",
    (
      nativeAmount: string,
      externalAmount: string,
      pooledNativeAmount: string,
      pooledExternalAmount: string,
      poolUnits: string,
      expected: string,
    ) => {
      const output = calculatePoolUnits(
        nativeAmount,
        externalAmount,
        pooledNativeAmount,
        pooledExternalAmount,
        poolUnits,
      );

      expect(output.minus(expected).abs().toNumber()).toBeLessThan(
        new BigNumber(expected).times(BUFFER_PERCENTAGE).toNumber(),
      );
    },
  );
});
