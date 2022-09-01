import { Decimal } from "@cosmjs/math";
import { runCatching } from "@sifchain/common";
import { Maybe } from "@sifchain/utils";
import { useQuery } from "@tanstack/react-query";

import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import { useSifStargateClient } from "~/hooks/useSifStargateClient";
import { useEnhancedTokenQuery } from "./useEnhancedToken";

const COMMON_OPTIONS = {
  refetchInterval: 6000,
  enabled: true,
};

export function useSwapSimulationQuery(fromDenom: string, toDenom: string, fromAmount: string, slippage = 0.01) {
  const { data: fromToken } = useEnhancedTokenQuery(fromDenom, COMMON_OPTIONS);
  const { data: toToken } = useEnhancedTokenQuery(toDenom, COMMON_OPTIONS);
  const { data: stargateClient } = useSifStargateClient();
  const { data: pmtpParams } = useSifnodeQuery("clp.getPmtpParams", [{}], COMMON_OPTIONS);
  const { data: swapFeeRateResult } = useSifnodeQuery("clp.getSwapFeeRate", [{}], COMMON_OPTIONS);

  const compute = (amount = fromAmount) => {
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
        Maybe.of(swapFeeRateResult).mapOr("0", (x) => Decimal.fromAtomics(x.swapFeeRate, 18).toString()),
      );
    });

    return result;
  };

  const derivedQuery = useQuery(
    ["swap-simulation", fromDenom, toDenom, fromAmount, slippage, swapFeeRateResult],
    compute.bind(null, undefined),
    {
      enabled: Boolean(fromToken && toToken && stargateClient && pmtpParams && swapFeeRateResult),
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
