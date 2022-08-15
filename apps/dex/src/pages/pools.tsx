import { Button, ChevronDownIcon, Maybe, PoolsIcon, RacetrackSpinnerIcon, SearchInput } from "@sifchain/ui";
import { isNilOrWhitespace } from "@sifchain/utils";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { sort } from "rambda";
import { descend } from "ramda";
import { ChangeEventHandler, useCallback, useMemo } from "react";
import tw from "tailwind-styled-components";
import AssetIcon from "~/compounds/AssetIcon";
import ManageLiquidityModal from "~/compounds/ManageLiquidityModal/ManageLiquidityModal";
import { useLiquidityProvidersQuery, usePoolsQuery } from "~/domains/clp";
import { useCurrentRewardPeriodQuery } from "~/domains/clp/hooks/rewardPeriod";
import useCancelLiquidityUnlockMutation from "~/domains/clp/hooks/useCancelLiquidityUnlockMutation";
import useRemoveLiquidityMutation from "~/domains/clp/hooks/useRemoveLiquidityMutation";
import { useDexEnvironment } from "~/domains/core/envs";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useSifApiQuery from "~/hooks/useSifApiQuery";
import { getFirstQueryValue } from "~/utils/query";

const DetailDataList = tw.dl`
  grid auto-cols-auto gap-y-1
  [&>dt]:col-start-1 [&>dd]:col-start-2 [&>dt]:text-gray-300 [&>dd]:font-semibold [&>dd]:text-right md:flex-1
`;

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

        const liquidityProvider = liquidityProviderQuery.data?.liquidityProviderData.find(
          (y) => y.liquidityProvider?.asset?.symbol === token?.denom,
        );
        const pool = poolsQuery.data?.pools.find((y) => y.externalAsset?.symbol === token?.denom);

        if (liquidityProvider?.liquidityProvider === undefined || pool === undefined)
          return {
            ...x,
            denom: token?.denom,
            nativeAssetBalance: 0,
            externalAssetBalance: 0,
            poolNativeAssetBalance: pool?.nativeAssetBalance.toFloatApproximation() ?? 0,
            poolExternalAssetBalance: pool?.externalAssetBalance.toFloatApproximation() ?? 0,
            liquidityProviderPoolShare: 0,
            liquidityProviderPoolValue: 0,
            unlock: undefined,
          };

        const rowanPoolValue = new BigNumber(tokenStatsQuery.data.rowanUSD ?? 0).times(
          liquidityProvider.nativeAssetBalance.toString(),
        );

        const externalAssetPoolValue = new BigNumber(x.priceToken ?? 0).times(
          liquidityProvider.externalAssetBalance.toString(),
        );

        const currentUnlockRequest = liquidityProvider.liquidityProvider.unlocks[0];

        const poolShare = new BigNumber(liquidityProvider.liquidityProvider.liquidityProviderUnits).div(pool.poolUnits);

        const nativeAssetBalance = new BigNumber(pool.nativeAssetBalance.toString()).times(poolShare).toNumber();

        const externalAssetBalance = new BigNumber(pool.externalAssetBalance.toString()).times(poolShare).toNumber();

        return {
          ...x,
          denom: token?.denom,
          nativeAssetBalance,
          externalAssetBalance,
          poolNativeAssetBalance: pool.nativeAssetBalance.toFloatApproximation(),
          poolExternalAssetBalance: pool.externalAssetBalance.toFloatApproximation(),
          liquidityProviderPoolShare: poolShare.toNumber(),
          liquidityProviderPoolValue: rowanPoolValue.plus(externalAssetPoolValue).toNumber(),
          unlock: currentUnlockRequest?.expired ? undefined : currentUnlockRequest,
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

const PoolsPage: NextPage = () => {
  const router = useRouter();
  const { data: env } = useDexEnvironment();
  const { data } = usePoolsPageData();
  const { data: currentRewardPeriod } = useCurrentRewardPeriodQuery();

  const searchQuery = decodeURIComponent(getFirstQueryValue(router.query["q"]) ?? "");

  const filteredPools = useMemo(
    () =>
      !searchQuery ? data : data?.filter((x) => x.symbol?.toLowerCase().includes(searchQuery.trim().toLowerCase())),
    [data, searchQuery],
  );

  const filteredAndSortedPools = useMemo(
    () =>
      sort(
        descend((x) => x.liquidityProviderPoolValue),
        filteredPools ?? [],
      ),
    [filteredPools],
  );

  const removeLiquidityMutation = useRemoveLiquidityMutation();
  const cancelUnlockMutation = useCancelLiquidityUnlockMutation();

  const selectedDenom = Maybe.of(getFirstQueryValue(router.query["denom"])).mapOrUndefined(decodeURIComponent);

  return (
    <>
      <section className="w-full flex-1 bg-black p-6 md:py-12 md:px-24">
        <header className="mb-10 md:mb-12">
          <div className="flex items-center justify-between pb-6 md:pb-8">
            <h2 className="text-2xl font-bold text-white">Pools</h2>
            <SearchInput
              placeholder="Search token"
              value={searchQuery}
              onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
                (event) => {
                  const { q: _q, ...queryWithoutQ } = router.query;
                  router.replace(
                    {
                      query: isNilOrWhitespace(event.target.value)
                        ? queryWithoutQ
                        : {
                            ...queryWithoutQ,
                            q: isNilOrWhitespace(event.target.value)
                              ? undefined
                              : encodeURIComponent(event.target.value),
                          },
                    },
                    undefined,
                    { shallow: true },
                  );
                },
                [router],
              )}
            />
          </div>
          <div className="flex flex-col gap-4">
            {filteredAndSortedPools?.map((x, index) => (
              <details
                key={index}
                className="[&[open]_.marker]:rotate-180 overflow-hidden rounded-md border-2 border-stone-800"
              >
                <summary className="flex flex-col bg-gray-800 p-3">
                  <header className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="[&>*:first-child]:-mr-4 flex items-center">
                        <AssetIcon network="sifchain" symbol={env?.nativeAsset.symbol ?? ""} size="md" />
                        <AssetIcon network="sifchain" symbol={x.symbol ?? ""} size="md" />
                      </div>
                      <span className="font-bold">{x.symbol?.toUpperCase()}</span>
                    </div>
                    <button className="marker pointer-events-none">
                      <ChevronDownIcon />
                    </button>
                  </header>
                  <dl className="[&>dt]:col-start-1 [&>dd]:col-start-2 [&>dd]:text-right [&>dd]:font-semibold grid auto-cols-auto gap-y-1">
                    <dt>My pool value</dt>
                    <dd>
                      {x.liquidityProviderPoolValue?.toLocaleString(undefined, {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 2,
                      })}
                    </dd>
                    <dt>My pool share</dt>
                    <dd>
                      {x.liquidityProviderPoolShare?.toLocaleString(undefined, {
                        style: "percent",
                        maximumFractionDigits: 2,
                      })}
                    </dd>
                  </dl>
                </summary>
                <div className="p-3 md:py-6 md:px-28">
                  <div className="md:flex md:gap-28">
                    <DetailDataList>
                      <dt className="md:hidden">TVL</dt>
                      <dd className="md:hidden">
                        {x.poolTVL?.toLocaleString(undefined, {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 2,
                        })}
                      </dd>
                      <dt className="md:hidden">APR</dt>
                      <dd className="md:hidden">
                        {x.poolApr?.toLocaleString(undefined, {
                          style: "percent",
                        })}
                      </dd>
                      <dt className="hidden md:inline">Your liquidity</dt>
                      <dd className="hidden items-center justify-end gap-1 md:flex">
                        {x.externalAssetBalance.toLocaleString()}
                        <AssetIcon size="sm" symbol={x.denom ?? ""} />
                      </dd>
                      <dt className="hidden md:inline">Pool liquidity</dt>
                      <dd className="hidden items-center justify-end gap-1 md:flex">
                        {x.poolExternalAssetBalance.toLocaleString()}
                        <AssetIcon size="sm" symbol={x.denom ?? ""} />
                      </dd>
                      <dt>24hr trading volume</dt>
                      <dd>
                        {x.volume?.toLocaleString(undefined, {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 2,
                        })}
                      </dd>
                      <dt>Arb opportunity</dt>
                      <dd
                        className={clsx({
                          "text-emerald-600": (x.arb ?? 0) > 0,
                          "text-rose-700": (x.arb ?? 0) < 0,
                        })}
                      >
                        {x.arb &&
                          (x.arb / 100).toLocaleString(undefined, {
                            style: "percent",
                            maximumFractionDigits: 2,
                          })}
                      </dd>
                    </DetailDataList>
                    <DetailDataList className="hidden md:grid">
                      <dt>Your liquidity</dt>
                      <dd className="flex items-center justify-end gap-1">
                        {x.nativeAssetBalance.toLocaleString()}
                        <AssetIcon size="sm" symbol={env?.nativeAsset.symbol ?? ""} />
                      </dd>
                      <dt>Pool liquidity</dt>
                      <dd className="flex items-center justify-end gap-1">
                        {x.poolNativeAssetBalance.toLocaleString()}
                        <AssetIcon size="sm" symbol={env?.nativeAsset.symbol ?? ""} />
                      </dd>
                      <dt>Rewards paid to the pool</dt>
                      <dd>{x.rewardPeriodNativeDistributed?.toLocaleString()}</dd>
                      <dt>Rewards time remaining</dt>
                      <dd>
                        {currentRewardPeriod && formatDistanceToNow(currentRewardPeriod.estimatedRewardPeriodEndDate)}
                      </dd>
                    </DetailDataList>
                  </div>
                  <Button
                    className="mt-2 w-full"
                    variant="secondary"
                    onClick={() => {
                      if (!isNilOrWhitespace(x.denom)) {
                        router.push(`/pools?action=add&denom=${encodeURIComponent(x.denom)}`);
                      }
                    }}
                  >
                    <PoolsIcon /> Pool
                  </Button>
                  {x.unlock && (
                    <div className="mt-2 flex gap-3">
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() =>
                          cancelUnlockMutation.mutate({
                            denom: x.denom ?? "",
                            units: x.unlock?.units ?? "0",
                          })
                        }
                        disabled={cancelUnlockMutation.isLoading || removeLiquidityMutation.isLoading}
                      >
                        {cancelUnlockMutation.isLoading && cancelUnlockMutation.variables?.denom === x.denom && (
                          <RacetrackSpinnerIcon />
                        )}
                        Cancel request
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() =>
                          removeLiquidityMutation.mutate({
                            denom: x.denom ?? "",
                            units: x.unlock?.units ?? "0",
                          })
                        }
                        disabled={cancelUnlockMutation.isLoading || removeLiquidityMutation.isLoading}
                      >
                        {removeLiquidityMutation.isLoading && removeLiquidityMutation.variables?.denom === x.denom && (
                          <RacetrackSpinnerIcon />
                        )}
                        Claim liquidity
                      </Button>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </header>
      </section>
      <ManageLiquidityModal
        isOpen={!isNilOrWhitespace(selectedDenom)}
        denom={selectedDenom ?? ""}
        onClose={useCallback(() => router.replace({ query: {} }), [router])}
        action={getFirstQueryValue<any>(router.query["action"])}
        onChangeDenom={useCallback(
          (denom) =>
            router.replace(
              {
                query: { ...router.query, denom: encodeURIComponent(denom) },
              },
              undefined,
              { shallow: true },
            ),
          [router],
        )}
        onChangeAction={useCallback(
          (action) =>
            router.replace({ query: { ...router.query, action } }, undefined, {
              shallow: true,
            }),
          [router],
        )}
      />
    </>
  );
};

export default PoolsPage;
