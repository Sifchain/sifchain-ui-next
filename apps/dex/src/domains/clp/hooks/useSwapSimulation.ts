import { Decimal } from "@cosmjs/math";
import { runCatching } from "@sifchain/common";
import type { SifSigningStargateClient } from "@sifchain/stargate";
import { Maybe } from "@sifchain/utils";
import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "bignumber.js";
import type { ArgumentTypes } from "rambda";
import { useCallback, useMemo } from "react";

import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import { useSifStargateClient } from "~/hooks/useSifStargateClient";

import { useEnhancedTokenQuery } from "./useEnhancedToken";

const COMMON_OPTIONS = {
  refetchInterval: 6000,
  enabled: true,
};

type SimulateSwapSyncArgs = ArgumentTypes<SifSigningStargateClient["simulateSwapSync"]>;

export function useSwapSimulationQuery(fromDenom: string, toDenom: string, fromAmount: string, slippage = 0) {
  const { data: fromToken } = useEnhancedTokenQuery(fromDenom, COMMON_OPTIONS);
  const { data: toToken } = useEnhancedTokenQuery(toDenom, COMMON_OPTIONS);
  const { data: stargateClient } = useSifStargateClient();
  const { data: pmtpParams } = useSifnodeQuery("clp.getPmtpParams", [{}], COMMON_OPTIONS);
  const { data: swapFeeRateResult } = useSifnodeQuery("clp.getSwapFeeParams", [{}], COMMON_OPTIONS);
  const { data: marginParamsResult } = useSifnodeQuery("margin.getParams", [{}], COMMON_OPTIONS);

  const pmtpBlockRate = pmtpParams?.pmtpRateParams?.pmtpPeriodBlockRate ?? "0";

  const swapFeeRate = Maybe.of(swapFeeRateResult?.swapFeeRate).mapOr("0", (x) => Decimal.fromAtomics(x, 18).toString());

  const marginEnabledPools = useMemo(
    () => new Set(marginParamsResult?.params?.pools || []),
    [marginParamsResult?.params?.pools],
  );

  const compute = useCallback(
    (amount = fromAmount) => {
      const fromPool = fromToken?.pool ?? toToken?.pool;
      const toPool = toToken?.pool ?? fromToken?.pool;

      const [_, fromAmountDecimal] = runCatching(() => Decimal.fromUserInput(amount, fromToken?.decimals ?? 0));

      const [__, result] = runCatching(() => {
        const fromCoin: SimulateSwapSyncArgs[0] = {
          denom: fromToken?.denom ?? fromToken?.symbol ?? "",
          amount: fromAmountDecimal?.atomics ?? "0",
          nativeAssetBalance: fromPool?.nativeAssetBalance ?? "0",
          externalAssetBalance: fromPool?.externalAssetBalance ?? "0",
          ...fromPool, // pass on additional pool data
          isMarginEnabled: marginEnabledPools.has(fromPool?.externalAsset?.symbol ?? ""),
        };

        const toCoin: SimulateSwapSyncArgs[1] = {
          denom: toToken?.denom ?? toToken?.symbol ?? "",
          nativeAssetBalance: toPool?.nativeAssetBalance ?? "0",
          externalAssetBalance: toPool?.externalAssetBalance ?? "0",
          ...toPool, // pass on additional pool data
          isMarginEnabled: marginEnabledPools.has(toPool?.externalAsset?.symbol ?? ""),
        };

        return stargateClient?.simulateSwapSync(fromCoin, toCoin, {
          pmtpBlockRate: pmtpBlockRate,
          swapFeeRate,
          slippage,
        });
      });

      return result;
    },
    [fromAmount, fromToken, toToken, swapFeeRate, stargateClient, marginEnabledPools, pmtpBlockRate, slippage],
  );

  const derivedQuery = useQuery(
    ["swap-simulation", fromDenom, toDenom, fromAmount, slippage, swapFeeRateResult],
    compute.bind(null, undefined),
    {
      enabled: Boolean(fromToken && toToken && stargateClient && pmtpParams && swapFeeRateResult),
    },
  );

  return {
    ...derivedQuery,
    swapFeeRate,
    recompute(fromAmount: string) {
      const res = compute(fromAmount);

      return res;
    },
  };
}

const withLeverage = (amount: string, leverage: string | number) => BigNumber(amount).times(leverage).toString();

export function useMarginPositionSimulationQuery(fromDenom: string, toDenom: string, fromAmount: string, leverage = 0) {
  const leveragedAmount = useMemo(() => withLeverage(fromAmount, leverage), [fromAmount, leverage]);

  const derivedQuery = useSwapSimulationQuery(fromDenom, toDenom, leveragedAmount, 0);

  return {
    ...derivedQuery,
    recompute(fromAmount: string, leverage: number) {
      const leveragedAmount = withLeverage(fromAmount, leverage);
      return derivedQuery.recompute(leveragedAmount);
    },
  };
}
