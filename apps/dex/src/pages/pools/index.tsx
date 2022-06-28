import { Disclosure } from "@headlessui/react";
import type { IAsset } from "@sifchain/common";
import type { Pool } from "@sifchain/proto-types/sifnode/clp/v1/types";
import type { GetTokenStatsResponsePools } from "@sifchain/sif-api";
import { ChevronDownIcon, formatNumberAsCurrency } from "@sifchain/ui";
import clsx from "clsx";
import type { NextPage } from "next";
import type { FC } from "react";

import AssetIcon from "~/compounds/AssetIcon";
import { useEnhancedPoolsQuery } from "~/domains/clp/hooks";
import PageLayout from "~/layouts/PageLayout";

const Pools: NextPage = () => {
  const { data: enhancedPools, isLoading, isSuccess } = useEnhancedPoolsQuery();

  return (
    <PageLayout heading="Pools">
      {isLoading && <p>Loading pools...</p>}
      {isSuccess && (
        <ul className="grid gap-4">
          {enhancedPools?.map((pool) => (
            <PoolItem
              key={pool.externalAsset?.symbol}
              pool={pool}
              stats={pool.stats}
              asset={pool.asset}
            />
          ))}
        </ul>
      )}
    </PageLayout>
  );
};

const PoolItem: FC<{
  pool: Pool;
  asset: IAsset;
  stats?: GetTokenStatsResponsePools;
}> = ({ asset, stats }) => {
  const columns = [
    {
      label: "Total liquidity",
      value: formatNumberAsCurrency(stats?.poolTVL ?? 0),
    },
    {
      label: "Trading volume",
      value: formatNumberAsCurrency(stats?.volume ?? 0),
    },
    {
      label: "Pool APR",
      value: `${(stats?.poolApr ?? 0).toFixed(2)}%`,
    },
    {
      label: "Arb opportunity",
      value: (
        <span
          className={Number(stats?.arb) > 0 ? "text-green-500" : "text-red-500"}
        >
          {(stats?.arb ?? 0).toFixed(2)}%
        </span>
      ),
    },
  ];
  return (
    <li className="rounded-lg bg-gray-800 hover:opacity-90 transition-opacity overflow-x-hidden grid gap-2">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex gap-1 items-center p-4 font-semibold justify-between">
              <div className="flex items-center gap-2">
                <AssetIcon network="sifchain" symbol="rowan" size="md" />
                ROWAN -
                <AssetIcon network="sifchain" symbol={asset.symbol} size="md" />
                {asset.displaySymbol.toUpperCase()}
              </div>
              <div>
                <ChevronDownIcon
                  className={clsx("transition-transform", {
                    "-rotate-180": open,
                  })}
                />
              </div>
            </Disclosure.Button>
            <Disclosure.Panel>
              {open && (
                <ul className="grid gap-2 p-4 bg-gray-850 text-sm">
                  {columns.map((stat) => (
                    <li key={stat.label} className="flex justify-between">
                      <span className="text-gray-300 font-normal">
                        {stat.label}
                      </span>
                      <span className="text-gray-50 font-semibold">
                        {stat.value}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </li>
  );
};

export default Pools;
