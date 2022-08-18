import { describe, expect, test } from "vitest";

import { Amount } from "../entities";
import { getMantissaFromDynamicMantissa } from "./format";

const mantissaRange = {
  10000: 2,
  1: 6,
  1000: 4,
  infinity: 0,
};

type TestCase = [amount: string, expected: number];

const TEST_CASES: TestCase[] = [
  ["500000", 0],
  ["10000", 0],
  ["9999", 2],
  ["999", 4],
  ["0.5", 6],
];

describe("parseDynamicMantissa", () => {
  TEST_CASES.forEach(([amount, expected]) => {
    test("getMantissaFromDynamicMantissa", () => {
      expect(getMantissaFromDynamicMantissa(Amount(amount), mantissaRange)).toBe(expected);
    });
  });
});
