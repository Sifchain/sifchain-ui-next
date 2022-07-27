import { Button, ChevronDownIcon, PoolsIcon, SearchInput } from "@sifchain/ui";
import BigNumber from "bignumber.js";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { sort } from "rambda";
import { descend } from "ramda";
import { ChangeEventHandler, useCallback, useMemo } from "react";
import AssetIcon from "~/compounds/AssetIcon";
import { useLiquidityProvidersQuery, usePoolsQuery } from "~/domains/clp";
import { useTokenRegistryQuery } from "~/domains/tokenRegistry";
import useSifApiQuery from "~/hooks/useSifApiQuery";
import { getFirstQueryValue } from "~/utils/query";
import { isNilOrWhitespace } from "~/utils/string";

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

        if (
          liquidityProvider?.liquidityProvider === undefined ||
          pool === undefined
        )
          return {
            ...x,
            liquidityProviderPoolShare: 0,
            liquidityProviderPoolValue: 0,
          };

        const rowanPoolValue = new BigNumber(
          tokenStatsQuery.data.rowanUSD ?? 0,
        ).times(liquidityProvider.nativeAssetBalance.toString());

        const externalAssetPoolValue = new BigNumber(x.priceToken ?? 0).times(
          liquidityProvider.externalAssetBalance.toString(),
        );

        return {
          ...x,
          liquidityProviderPoolShare: new BigNumber(
            liquidityProvider.liquidityProvider.liquidityProviderUnits,
          )
            .div(pool.poolUnits)
            .toNumber(),
          liquidityProviderPoolValue: rowanPoolValue
            .plus(externalAssetPoolValue)
            .toNumber(),
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

const Pools: NextPage = () => {
  const router = useRouter();
  const { data } = usePoolsPageData();
  const searchQuery = decodeURIComponent(
    getFirstQueryValue(router.query["q"]) ?? "",
  );

  const filteredPools = useMemo(
    () =>
      !searchQuery
        ? data
        : data?.filter((x) =>
            x.symbol?.toLowerCase().includes(searchQuery.trim().toLowerCase()),
          ),
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

  return (
    <section className="flex-1 w-full bg-black p-6 md:py-12 md:px-24">
      <header className="mb-10 md:mb-12">
        <div className="flex items-center justify-between pb-6 md:pb-8">
          <h2 className="text-2xl font-bold text-white">Pools</h2>
          <SearchInput
            placeholder="Search token"
            value={searchQuery}
            onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
              (event) => {
                const { q: _, ...queryWithoutQ } = router.query;
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
              className="border-2 border-stone-800 rounded-md overflow-hidden [&[open]_.marker]:rotate-180"
            >
              <summary className="flex flex-col p-3 bg-gray-800">
                <header className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center [&>*:first-child]:-mr-4">
                      <AssetIcon network="sifchain" symbol="rowan" size="md" />
                      <AssetIcon
                        network="sifchain"
                        symbol={x.symbol ?? ""}
                        size="md"
                      />
                    </div>
                    <span className="font-bold">{x.symbol?.toUpperCase()}</span>
                  </div>
                  <button className="marker pointer-events-none">
                    <ChevronDownIcon />
                  </button>
                </header>
                <dl className="grid auto-cols-auto gap-y-1 [&>dt]:col-start-1 [&>dd]:col-start-2 [&>dd]:font-semibold [&>dd]:text-right">
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
              <div className="p-3">
                <dl className="grid auto-cols-auto gap-y-1 [&>dt]:col-start-1 [&>dd]:col-start-2 [&>dt]:text-gray-300 [&>dd]:font-semibold [&>dd]:text-right">
                  <dt>TVL</dt>
                  <dd>
                    {x.poolTVL?.toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 2,
                    })}
                  </dd>
                  <dt>APR</dt>
                  <dd>
                    {x.poolApr?.toLocaleString(undefined, {
                      style: "percent",
                    })}
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
                  <dd className="error-">
                    {x.arb &&
                      (x.arb / 100).toLocaleString(undefined, {
                        style: "percent",
                        maximumFractionDigits: 2,
                      })}
                  </dd>
                </dl>
                <Button className="mt-2 w-full" variant="secondary">
                  <PoolsIcon /> Pool
                </Button>
              </div>
            </details>
          ))}
        </div>
      </header>
    </section>
  );
};

export default Pools;
