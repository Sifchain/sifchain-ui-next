import { Button, ChevronDownIcon, Maybe, PoolsIcon, RacetrackSpinnerIcon, SearchInput, SortIcon } from "@sifchain/ui";
import { isNilOrWhitespace } from "@sifchain/utils";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ascend, descend } from "@sifchain/utils";
import { ChangeEventHandler, useCallback, useMemo, useState } from "react";
import tw from "tailwind-styled-components";

import AssetIcon from "~/compounds/AssetIcon";
import ManageLiquidityModal from "~/compounds/ManageLiquidityModal/ManageLiquidityModal";
import { useCurrentRewardPeriodQuery } from "~/domains/clp/hooks/rewardPeriod";
import useCancelLiquidityUnlockMutation from "~/domains/clp/hooks/useCancelLiquidityUnlockMutation";
import useRemoveLiquidityMutation from "~/domains/clp/hooks/useRemoveLiquidityMutation";
import { useDexEnvironment } from "~/domains/core/envs";
import usePoolsPageData from "~/hooks/usePoolsPageData";
import { getFirstQueryValue } from "~/utils/query";

const currencyFormat = Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const percentFormat = Intl.NumberFormat(undefined, {
  style: "percent",
  maximumFractionDigits: 2,
});

const DetailDataList = tw.dl`
  grid auto-cols-auto gap-y-1
  [&>dt]:col-start-1 [&>dd]:col-start-2 [&>dt]:text-gray-300 [&>dd]:font-semibold [&>dd]:text-right md:flex-1
`;

const COLUMNS = ["token", "tvl", "apr", "my value", "my share"] as const;

const PoolsPage: NextPage = () => {
  const router = useRouter();
  const { data: env } = useDexEnvironment();
  const { data } = usePoolsPageData();
  const { data: currentRewardPeriod } = useCurrentRewardPeriodQuery();

  const [[sortByOrder, sortByProperty], setSortBy] = useState<["asc" | "desc", typeof COLUMNS[number] | undefined]>([
    "asc",
    undefined,
  ]);

  const searchQuery = decodeURIComponent(getFirstQueryValue(router.query["q"]) ?? "");

  const filteredPools = useMemo(
    () =>
      !searchQuery ? data : data?.filter((x) => x.symbol?.toLowerCase().includes(searchQuery.trim().toLowerCase())),
    [data, searchQuery],
  );

  const filteredAndSortedPools = useMemo(() => {
    const sortFunc = sortByOrder === "asc" ? ascend : descend;

    const pools = filteredPools ?? [];

    switch (sortByProperty) {
      case "token":
        return pools.sort(sortFunc((x) => x.displaySymbol ?? ""));
      case "tvl":
        return pools.sort(sortFunc((x) => x.poolTVL ?? 0));
      case "apr":
        return pools.sort(sortFunc((x) => x.poolApr ?? 0));
      case "my value":
        return pools.sort(sortFunc((x) => x.liquidityProviderPoolValue ?? 0));
      case "my share":
        return pools.sort(sortFunc((x) => x.liquidityProviderPoolShare ?? 0));
      default:
        return pools.sort(descend((x) => x.liquidityProviderPoolValue));
    }
  }, [filteredPools, sortByOrder, sortByProperty]);

  const removeLiquidityMutation = useRemoveLiquidityMutation();
  const cancelUnlockMutation = useCancelLiquidityUnlockMutation();

  const selectedDenom = Maybe.of(getFirstQueryValue(router.query["denom"])).mapOrUndefined(decodeURIComponent);

  const onPressPoolButton = useCallback(
    (denom?: string) => {
      if (!isNilOrWhitespace(denom)) {
        router.push(`/pools?action=add&denom=${encodeURIComponent(denom)}`);
      }
    },
    [router],
  );

  return (
    <>
      <section className="w-full flex-1 bg-black p-6 md:py-12 md:px-24">
        <header className="flex items-center justify-between pb-6 md:pb-8">
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
                          q: isNilOrWhitespace(event.target.value) ? undefined : encodeURIComponent(event.target.value),
                        },
                  },
                  undefined,
                  { shallow: true },
                );
              },
              [router],
            )}
          />
        </header>
        <header className="hidden px-3 pb-6 text-left text-xs uppercase opacity-80 md:flex">
          {[
            ...COLUMNS,
            // dummy column for flex alignment
            "",
          ].map((x, index) => (
            <div
              key={index}
              className={clsx("flex cursor-pointer items-center gap-1", {
                "flex-1 justify-start": index === 0,
                "flex-[1.6] justify-end": index > 0,
              })}
              onClick={() =>
                setSortBy((y) => [y[1] !== x ? "asc" : y[0] === "asc" ? "desc" : "asc", x as typeof COLUMNS[number]])
              }
            >
              {x}
              {!isNilOrWhitespace(x) && <SortIcon active={sortByProperty === x} sortDirection={sortByOrder} />}
            </div>
          ))}
        </header>
        <div className="flex flex-col gap-4">
          {filteredAndSortedPools?.map((x, index) => (
            <details
              key={index}
              className="overflow-hidden rounded-md border-2 border-stone-800 [&[open]_.marker]:rotate-180"
            >
              <summary className="flex flex-col bg-gray-800 p-3 md:flex-row">
                <header className="mb-2 flex items-center justify-between md:mb-0 md:flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center [&>*:first-child]:-mr-4">
                      <AssetIcon network="sifchain" symbol={env?.nativeAsset.symbol ?? ""} size="md" />
                      <AssetIcon network="sifchain" symbol={x.symbol ?? ""} size="md" />
                    </div>
                    <span className="font-bold">{x.symbol?.toUpperCase()}</span>
                  </div>
                  <button className="marker pointer-events-none md:hidden">
                    <ChevronDownIcon />
                  </button>
                </header>
                <dl className="grid auto-cols-auto gap-y-1 md:flex md:flex-[8] md:items-center [&>dt]:col-start-1 md:[&>dt]:hidden [&>dd]:col-start-2 [&>dd]:text-right [&>dd]:font-semibold md:[&>dd]:flex-1">
                  <dt className="hidden md:inline">TVL</dt>
                  <dd className="hidden md:inline">{Maybe.of(x.poolTVL).mapOr("...", currencyFormat.format)}</dd>
                  <dt className="hidden md:inline">APR</dt>
                  <dd className="hidden md:inline">
                    {Maybe.of(x.poolApr).mapOr("...", (apr) => percentFormat.format(apr / 100))}
                  </dd>
                  <dt>My pool value</dt>
                  <dd>{Maybe.of(x.liquidityProviderPoolValue).mapOr("...", currencyFormat.format)}</dd>
                  <dt>My pool share</dt>
                  <dd>{Maybe.of(x.liquidityProviderPoolShare).mapOr("...", percentFormat.format)}</dd>
                  <dt className="hidden md:inline">Actions</dt>
                  <dd className="hidden items-center justify-end gap-12 md:flex">
                    <Button variant="secondary" onClick={() => onPressPoolButton(x.denom)}>
                      <PoolsIcon /> Pool
                    </Button>
                    <button className="marker pointer-events-none">
                      <ChevronDownIcon />
                    </button>
                  </dd>
                </dl>
              </summary>
              <div className="p-3 md:py-6 md:px-28">
                <div className="md:flex md:gap-28">
                  <DetailDataList>
                    <dt className="md:hidden">TVL</dt>
                    <dd className="md:hidden">{Maybe.of(x.poolTVL).mapOr("...", currencyFormat.format)}</dd>
                    <dt className="md:hidden">APR</dt>
                    <dd className="md:hidden">
                      {Maybe.of(x.poolApr).mapOr("...", (apr) => percentFormat.format(apr / 100))}
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
                    <dt>Pool value ({x.displaySymbol?.toUpperCase()})</dt>
                    <dd>{currencyFormat.format(x.poolExternalAssetBalanceUsd)}</dd>
                    <dt>24hr trading volume</dt>
                    <dd>{Maybe.of(x.volume).mapOr("...", currencyFormat.format)}</dd>
                    <dt>Arb opportunity</dt>
                    <dd
                      className={clsx({
                        "text-emerald-600": (x.arb ?? 0) > 0,
                        "text-rose-700": (x.arb ?? 0) < 0,
                      })}
                    >
                      {Maybe.of(x.arb).mapOr("...", (arb) => percentFormat.format(arb / 100))}
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
                    <dt>Pool value ({env?.nativeAsset.displaySymbol.toUpperCase()})</dt>
                    <dd>{currencyFormat.format(x.poolNativeAssetBalanceUsd)}</dd>
                    <dt>Rewards paid to the pool</dt>
                    <dd>{x.rewardPeriodNativeDistributed?.toLocaleString()}</dd>
                    <dt>Rewards time remaining</dt>
                    <dd>
                      {currentRewardPeriod && formatDistanceToNow(currentRewardPeriod.estimatedRewardPeriodEndDate)}
                    </dd>
                  </DetailDataList>
                </div>
                <Button
                  className="mt-2 w-full md:hidden"
                  variant="secondary"
                  onClick={() => onPressPoolButton(x.denom)}
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
