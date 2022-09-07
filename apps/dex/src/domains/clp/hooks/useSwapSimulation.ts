import { Decimal } from "@cosmjs/math";
import { runCatching } from "@sifchain/common";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import { useSifStargateClient } from "~/hooks/useSifStargateClient";
import { useEnhancedTokenQuery } from "./useEnhancedToken";

const COMMON_OPTIONS = {
  refetchInterval: 6000,
  enabled: true,
};

export function useSwapSimulationQuery(fromDenom: string, toDenom: string, fromAmount: string, slippage = 0) {
  const { data: fromToken } = useEnhancedTokenQuery(fromDenom, COMMON_OPTIONS);
  const { data: toToken } = useEnhancedTokenQuery(toDenom, COMMON_OPTIONS);
  const { data: stargateClient } = useSifStargateClient();
  const { data: pmtpParams } = useSifnodeQuery("clp.getPmtpParams", [{}], COMMON_OPTIONS);
  const FEE_IS_APPLIED_AFTER_SWAP = "0";

  const compute = useCallback(
    (amount = fromAmount) => {
      const fromPool = fromToken?.pool ?? toToken?.pool;
      const toPool = toToken?.pool ?? fromToken?.pool;

      const [_, fromAmountDecimal] = runCatching(() => Decimal.fromUserInput(amount, fromToken?.decimals ?? 0));

      const [__, result] = runCatching(() => {
        const fromCoin = {
          denom: fromToken?.denom ?? fromToken?.symbol ?? "",
          amount: fromAmountDecimal?.atomics ?? "0",
          poolNativeAssetBalance: fromPool?.nativeAssetBalance ?? "0",
          poolExternalAssetBalance: fromPool?.externalAssetBalance ?? "0",
        };

        const toCoin = {
          denom: toToken?.denom ?? toToken?.symbol ?? "",
          poolNativeAssetBalance: toPool?.nativeAssetBalance ?? "0",
          poolExternalAssetBalance: toPool?.externalAssetBalance ?? "0",
        };

        return stargateClient?.simulateSwapSync(
          fromCoin,
          toCoin,
          pmtpParams?.pmtpRateParams?.pmtpPeriodBlockRate ?? "0",
          slippage,
          FEE_IS_APPLIED_AFTER_SWAP,
        );
      });

      return result;
    },
    [fromAmount, fromToken, pmtpParams, slippage, stargateClient, toToken],
  );

  const derivedQuery = useQuery(
    ["swap-simulation", fromDenom, toDenom, fromAmount, slippage],
    compute.bind(null, undefined),
    {
      enabled: Boolean(fromToken && toToken && stargateClient && pmtpParams),
    },
  );

  return {
    ...derivedQuery,
    recompute(fromAmount: string) {
      const res = compute(fromAmount);

      return res;
    },
  };
}
