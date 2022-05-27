import { describe, expect, test } from "vitest";
import { TransactionStatus } from "../entities/Transaction";

import { parseTxFailure } from "./parseTxFailure";

type TestCase = [
  txFailure: {
    transactionHash: string;
    rawLog?: string;
  },
  expected: TransactionStatus,
];

const TEST_CASES: TestCase[] = [
  [
    {
      transactionHash: "123",
      rawLog: "",
    },
    {
      hash: "123",
      memo: "There was an unknown failure",
      state: "failed",
    },
  ],
  [
    {
      transactionHash: "123",
      rawLog: "something was below expected",
    },
    {
      hash: "123",
      memo: "Your transaction has failed - Received amount is below expected",
      state: "failed",
    },
  ],
  [
    {
      transactionHash: "123",
      rawLog: "yegads swap_failed!",
    },
    {
      hash: "123",
      memo: "Your transaction has failed",
      state: "failed",
    },
  ],
  [
    {
      transactionHash: "123",
      rawLog: "your Request rejected!",
    },

    {
      hash: "123",
      memo: "You have rejected the transaction",
      state: "rejected",
    },
  ],
];

describe("parseTxFailure", () => {
  TEST_CASES.forEach(([txFailure, expected]) => {
    test("parseTxFailure", () => {
      expect(parseTxFailure(txFailure)).toMatchObject(expected);
    });
  });
});
