import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { useLiquidityProvidersQuery, usePoolsQuery } from "~/domains/clp";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useSifApiQuery from "~/hooks/useSifApiQuery";

const usePoolsPageData = () => {
  const tokenRegistryQuery = useTokenRegistryQuery();
  const tokenStatsQuery = useSifApiQuery("assets.getTokenStats", []);
  const liquidityProviderQuery = useLiquidityProvidersQuery();
  const poolsQuery = usePoolsQuery();

  return useMemo(
    () => ({
      isLoading: tokenStatsQuery.isLoading || liquidityProviderQuery.isLoading,
      data: tokenStatsQuery.data?.pools?.map((x) => {
        const token = tokenRegistryQuery.indexedByDisplaySymbol[x.symbol ?? ""];

        const liquidityProvider =
          liquidityProviderQuery.data?.liquidityProviderData.find(
            (y) => y.liquidityProvider?.asset?.symbol === token?.denom,
          );
        const pool = poolsQuery.data?.pools.find(
          (y) => y.externalAsset?.symbol === token?.denom,
        );

        const poolNativeAssetBalanceUsd = new BigNumber(
          pool?.nativeAssetBalance.toString() ?? 0,
        )
          .times(tokenStatsQuery.data.rowanUSD ?? 0)
          .toNumber();
        const poolExternalAssetBalanceUsd = new BigNumber(
          pool?.externalAssetBalance.toString() ?? 0,
        )
          .times(x.priceToken ?? 0)
          .toNumber();

        if (
          liquidityProvider?.liquidityProvider === undefined ||
          pool === undefined
        )
          return {
            ...x,
            denom: token?.denom,
            displaySymbol: token?.displaySymbol,
            nativeAssetBalance: 0,
            externalAssetBalance: 0,
            poolNativeAssetBalance:
              pool?.nativeAssetBalance.toFloatApproximation() ?? 0,
            poolExternalAssetBalance:
              pool?.externalAssetBalance.toFloatApproximation() ?? 0,
            poolNativeAssetBalanceUsd,
            poolExternalAssetBalanceUsd,
            liquidityProviderPoolShare: 0,
            liquidityProviderPoolValue: 0,
            unlock: undefined,
          };

        const rowanPoolValue = new BigNumber(
          tokenStatsQuery.data.rowanUSD ?? 0,
        ).times(liquidityProvider.nativeAssetBalance.toString());

        const externalAssetPoolValue = new BigNumber(x.priceToken ?? 0).times(
          liquidityProvider.externalAssetBalance.toString(),
        );

        const currentUnlockRequest =
          liquidityProvider.liquidityProvider.unlocks[0];

        const poolShare = new BigNumber(
          liquidityProvider.liquidityProvider.liquidityProviderUnits,
        ).div(pool.poolUnits);

        const nativeAssetBalance = new BigNumber(
          pool.nativeAssetBalance.toString(),
        )
          .times(poolShare)
          .toNumber();

        const externalAssetBalance = new BigNumber(
          pool.externalAssetBalance.toString(),
        )
          .times(poolShare)
          .toNumber();

        return {
          ...x,
          denom: token?.denom,
          displaySymbol: token?.displaySymbol,
          nativeAssetBalance,
          externalAssetBalance,
          poolNativeAssetBalance:
            pool.nativeAssetBalance.toFloatApproximation(),
          poolExternalAssetBalance:
            pool.externalAssetBalance.toFloatApproximation(),
          poolNativeAssetBalanceUsd,
          poolExternalAssetBalanceUsd,
          liquidityProviderPoolShare: poolShare.toNumber(),
          liquidityProviderPoolValue: rowanPoolValue
            .plus(externalAssetPoolValue)
            .toNumber(),
          unlock: currentUnlockRequest?.expired
            ? undefined
            : currentUnlockRequest,
        };
      }),
    }),
    [
      liquidityProviderQuery.data?.liquidityProviderData,
      liquidityProviderQuery.isLoading,
      poolsQuery.data?.pools,
      tokenRegistryQuery.indexedByDisplaySymbol,
      tokenStatsQuery.data?.pools,
      tokenStatsQuery.data?.rowanUSD,
      tokenStatsQuery.isLoading,
    ],
  );
};

export default usePoolsPageData;
