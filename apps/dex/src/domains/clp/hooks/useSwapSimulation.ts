import { Decimal } from "@cosmjs/math";
import { runCatching } from "@sifchain/common";
import { useCallback, useEffect, useState } from "react";

import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import { useSifStargateClient } from "~/hooks/useSifStargateClient";
import { useEnhancedTokenQuery } from "./useEnhancedToken";

const COMMON_OPTIONS = {
  refetchInterval: 6000,
  enabled: true,
};

export function useSwapSimulation(fromDenom: string, toDenom: string, fromAmount: string, slippage = 0.01) {
  const { data: fromToken } = useEnhancedTokenQuery(fromDenom, COMMON_OPTIONS);
  const { data: toToken } = useEnhancedTokenQuery(toDenom, COMMON_OPTIONS);
  const { data: stargateClient } = useSifStargateClient();
  const { data: pmtpParams } = useSifnodeQuery("clp.getPmtpParams", [{}], COMMON_OPTIONS);

  const [result, setResult] = useState<
    | {
        rawReceiving: string;
        minimumReceiving: string;
        liquidityProviderFee: string;
        priceImpact: number;
      }
    | undefined
  >(undefined);

  const compute = useCallback(
    (fromAmount = "") => {
      const fromPool = fromToken?.pool ?? toToken?.pool;
      const toPool = toToken?.pool ?? fromToken?.pool;

      const [_, fromAmountDecimal] = runCatching(() => Decimal.fromUserInput(fromAmount, fromToken?.decimals ?? 0));

      const [__, result] = runCatching(() =>
        stargateClient?.simulateSwapSync(
          {
            denom: fromToken?.denom ?? fromToken?.symbol ?? "",
            amount: fromAmountDecimal?.atomics ?? "0",
            poolNativeAssetBalance: fromPool?.nativeAssetBalance ?? "0",
            poolExternalAssetBalance: fromPool?.externalAssetBalance ?? "0",
          },
          {
            denom: toToken?.denom ?? toToken?.symbol ?? "",
            poolNativeAssetBalance: toPool?.nativeAssetBalance ?? "0",
            poolExternalAssetBalance: toPool?.externalAssetBalance ?? "0",
          },
          pmtpParams?.pmtpRateParams?.pmtpPeriodBlockRate,
          slippage,
        ),
      );

      return result;
    },
    [fromToken, toToken, stargateClient, pmtpParams?.pmtpRateParams?.pmtpPeriodBlockRate, slippage],
  );

  useEffect(() => {
    setResult(compute(fromAmount));
  }, [fromAmount, compute]);

  return {
    data: result,
    recompute(fromAmount: string) {
      const res = compute(fromAmount);
      setResult(res);

      return res;
    },
  };
}
