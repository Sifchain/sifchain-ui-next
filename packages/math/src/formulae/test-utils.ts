import BigNumber from "bignumber.js";

export type SwapTestCase = {
  x: string;
  X: string;
  Y: string;
  f: string;
  r: string;
  expectedSwap: string;
  expectedFee: string;
};

export const parseSwapTestCase = (params: SwapTestCase) =>
  [
    String(params["x"]),
    String(params["X"]),
    String(params["Y"]),
    String(params["f"]),
    String(params["r"]),
    String(params["expectedSwap"]),
    String(params["expectedFee"]),
  ] as const;

export const parseSwapParams = (params: SwapTestCase) => ({
  params: {
    inputAmount: BigNumber(String(params["x"])),
    inputBalanceInPool: BigNumber(String(params["X"])),
    outputBalanceInPool: BigNumber(String(params["Y"])),
    swapFeeRate: BigNumber(String(params["f"])),
    currentRatioShiftingRate: BigNumber(String(params["r"])),
  },
  expected: {
    swap: BigNumber(String(params["expectedSwap"])),
    fee: BigNumber(String(params["expectedFee"])),
  },
});
