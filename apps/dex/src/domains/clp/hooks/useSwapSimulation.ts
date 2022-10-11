import { Decimal } from "@cosmjs/math";
import { runCatching } from "@sifchain/common";
import { Maybe } from "@sifchain/utils";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { ROWAN } from "~/domains/assets";
import useSifnodeQuery from "~/hooks/useSifnodeQuery";
import { useSifStargateClient } from "~/hooks/useSifStargateClient";

import Pool from "../models/Pool";
import { useEnhancedTokenQuery } from "./useEnhancedToken";

const COMMON_OPTIONS = {
  refetchInterval: 6000,
  enabled: true,
};

export function useMarginPositionSimulationQuery(fromDenom: string, toDenom: string, fromAmount: string, leverage = 0) {
  const { data: fromToken } = useEnhancedTokenQuery(fromDenom, COMMON_OPTIONS);
  const { data: toToken } = useEnhancedTokenQuery(toDenom, COMMON_OPTIONS);
  const { data: pmtpParams } = useSifnodeQuery("clp.getPmtpParams", [{}], COMMON_OPTIONS);
  const { data: swapFeeRateResult } = useSifnodeQuery("clp.getSwapFeeRate", [{}], COMMON_OPTIONS);
  const { data: marginParamsResult } = useSifnodeQuery("margin.getParams", [{}], COMMON_OPTIONS);

  const pmtpPeriodBlockRate = pmtpParams?.pmtpRateParams?.pmtpPeriodBlockRate ?? "0";

  const marginEnabledPools = useMemo(
    () => new Set(marginParamsResult?.params?.pools || []),
    [marginParamsResult?.params?.pools],
  );

  const swapFeeRate = Maybe.of(swapFeeRateResult?.swapFeeRate).mapOr("0", (x) => Decimal.fromAtomics(x, 18).toString());

  const compute = useCallback(
    (amount = fromAmount, currentLeverage = leverage) => {
      const pool = fromToken?.pool ?? toToken?.pool;

      const [__, result] = runCatching(() => {
        if (!pool?.externalAsset || !fromToken || !toToken || !pmtpParams || !swapFeeRateResult) {
          throw new Error("Pool or amount is not defined");
        }

        const swapFeeRate = Maybe.of(swapFeeRateResult.swapFeeRate).mapOr("0", (x) =>
          Decimal.fromAtomics(x, 18).toString(),
        );

        const externalAssetDecimals = toDenom === "rowan" ? fromToken.decimals : ROWAN.decimals;
        const nativeAssetDecimals = toDenom === "rowan" ? ROWAN.decimals : fromToken.decimals;

        const params = {
          swapFeeRate,
          currentRatioShiftingRate: pmtpPeriodBlockRate,
          externalAssetDecimals: externalAssetDecimals,
          nativeAssetDecimals: nativeAssetDecimals,
          isMarginEnabled: marginEnabledPools.has(pool.externalAsset.symbol),
        };

        const poolInstance = new Pool(pool, params);

        return poolInstance.calculateMarginPosition({
          inputAmount: amount,
          inputDenom: fromDenom,
          leverage: currentLeverage,
        });
      });

      return Maybe.of(result).mapOrUndefined((result) => ({
        swap: result.swap.integerValue().toFixed(0),
        fee: result.fee.integerValue().toFixed(0),
      }));
    },
    [
      fromAmount,
      fromDenom,
      fromToken,
      leverage,
      marginEnabledPools,
      pmtpParams,
      pmtpPeriodBlockRate,
      swapFeeRateResult,
      toDenom,
      toToken,
    ],
  );

  const fromPoolBalance = fromToken?.pool?.externalAssetBalance ?? "0";
  const toPoolBalance = toToken?.pool?.nativeAssetBalance ?? "0";

  const derivedQuery = useQuery(
    [
      "margin-position-simulation",
      fromDenom,
      toDenom,
      fromAmount,
      leverage,
      swapFeeRateResult,
      fromPoolBalance,
      toPoolBalance,
    ],
    compute.bind(null, undefined, undefined),
    {
      enabled: Boolean(fromToken && toToken && pmtpParams && swapFeeRateResult),
    },
  );

  return {
    ...derivedQuery,
    swapFeeRate,
    recompute(fromAmount: string, leverage: number) {
      const res = compute(fromAmount, leverage);

      return res;
    },
  };
}

export function useSwapSimulationQuery(fromDenom: string, toDenom: string, fromAmount: string, slippage = 0) {
  const { data: fromToken } = useEnhancedTokenQuery(fromDenom, COMMON_OPTIONS);
  const { data: toToken } = useEnhancedTokenQuery(toDenom, COMMON_OPTIONS);
  const { data: stargateClient } = useSifStargateClient();
  const { data: pmtpParams } = useSifnodeQuery("clp.getPmtpParams", [{}], COMMON_OPTIONS);
  const { data: swapFeeRateResult } = useSifnodeQuery("clp.getSwapFeeRate", [{}], COMMON_OPTIONS);
  const { data: marginParamsResult } = useSifnodeQuery("margin.getParams", [{}], COMMON_OPTIONS);

  const currentPmtpPeriodBlockRate = pmtpParams?.pmtpRateParams?.pmtpPeriodBlockRate ?? "0";

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
        const fromCoin = {
          denom: fromToken?.denom ?? fromToken?.symbol ?? "",
          amount: fromAmountDecimal?.atomics ?? "0",
          poolNativeAssetBalance: fromPool?.nativeAssetBalance ?? "0",
          poolExternalAssetBalance: fromPool?.externalAssetBalance ?? "0",
        };

        if (fromDenom === "rowan" || toDenom === "rowan") {
          const pool = fromDenom === "rowan" ? toPool : fromPool;

          if (!pool?.externalAsset || !fromToken || !toToken || !pmtpParams || !swapFeeRateResult) {
            throw new Error("Pool or amount is not defined");
          }

          const externalAssetDecimals = toDenom === "rowan" ? fromToken.decimals : ROWAN.decimals;
          const nativeAssetDecimals = toDenom === "rowan" ? ROWAN.decimals : fromToken.decimals;

          const params = {
            swapFeeRate,
            currentRatioShiftingRate: currentPmtpPeriodBlockRate,
            externalAssetDecimals: externalAssetDecimals,
            nativeAssetDecimals: nativeAssetDecimals,
            isMarginEnabled: marginEnabledPools.has(pool.externalAsset?.symbol ?? ""),
          };

          const poolInstance = new Pool(pool, params);

          const swapResult = poolInstance.calculateSwap({
            inputAmount: amount,
            inputDenom: fromDenom,
          });

          return Maybe.of(swapResult).mapOr(
            {
              rawReceiving: "0",
              minimumReceiving: "0",
              liquidityProviderFee: "0",
              priceImpact: 0,
            },
            ({ swap, fee }) => ({
              rawReceiving: swap.plus(fee).integerValue().toFixed(0),
              minimumReceiving: swap.minus(swap.times(slippage)).integerValue().toFixed(0),
              liquidityProviderFee: fee.integerValue().toFixed(0),
              priceImpact: 0,
            }),
          );
        }

        const toCoin = {
          denom: toToken?.denom ?? toToken?.symbol ?? "",
          poolNativeAssetBalance: toPool?.nativeAssetBalance ?? "0",
          poolExternalAssetBalance: toPool?.externalAssetBalance ?? "0",
        };

        return stargateClient?.simulateSwapSync(
          fromCoin, // X
          toCoin, // Y
          currentPmtpPeriodBlockRate,
          slippage,
          Maybe.of(swapFeeRateResult).mapOr("0", (x) => Decimal.fromAtomics(x.swapFeeRate, 18).toString()),
        );
      });

      return result;
    },
    [
      fromAmount,
      fromToken,
      toToken,
      fromDenom,
      toDenom,
      stargateClient,
      currentPmtpPeriodBlockRate,
      slippage,
      swapFeeRateResult,
      pmtpParams,
      swapFeeRate,
      marginEnabledPools,
    ],
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
    recompute(fromAmount: string) {
      const res = compute(fromAmount);

      return res;
    },
  };
}
