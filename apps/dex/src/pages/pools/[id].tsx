import { Amount, AssetAmount, formatAssetAmount } from "@sifchain/common";
import { formatNumberAsCurrency } from "@sifchain/ui";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";
import AssetIcon from "~/compounds/AssetIcon";
import { ROWAN } from "~/domains/assets";

import { useEnhancedPoolQuery } from "~/domains/clp";
import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const PoolDetails: NextPage = () => {
  const { query } = useRouter();

  const externalAssetSymbol = String(query["id"]);

  const {
    data: pool,
    isLoading,
    isSuccess,
  } = useEnhancedPoolQuery(externalAssetSymbol);

  const poolSymbol = `${externalAssetSymbol.toUpperCase()} · ROWAN`;

  const statsSummary = useMemo(() => {
    if (!pool?.stats) {
      return [];
    }

    const { stats, nativeAssetBalance, externalAssetBalance } = pool;

    return [
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
            className={
              Number(stats?.arb) > 0 ? "text-green-500" : "text-red-500"
            }
          >
            {(stats?.arb ?? 0).toFixed(2)}%
          </span>
        ),
      },
      {
        label: "Total amount (ROWAN)",
        value: `${
          formatAssetAmount(AssetAmount(ROWAN, nativeAssetBalance)) ?? 0
        }`,
      },
      {
        label: `Total amount (${externalAssetSymbol.toUpperCase()})`,
        value: `${
          formatAssetAmount(AssetAmount(pool.asset, externalAssetBalance)) ?? 0
        }`,
      },
    ];
  }, [pool]);

  return (
    <MainLayout title={`Pools - ${externalAssetSymbol}`}>
      <PageLayout
        withBackNavigation
        heading={
          <>
            Pools / <span className="text-sifgray-50">{poolSymbol}</span>
          </>
        }
      >
        <div className="grid gap-8 max-w-lg">
          {isLoading && <p>Loading pool...</p>}
          {isSuccess && (
            <>
              <section className="grid gap-8">
                <header className="flex justify-between items-center">
                  <h2>Pool Details - {poolSymbol}</h2>
                  <TokenBadge
                    symbol={externalAssetSymbol}
                    priceUsd={pool?.stats?.priceToken ?? 0}
                  />
                </header>
              </section>
              <section className="grid gap-8">
                <header>
                  <h3 className="text-sifgray-50 font-semibold text-base">
                    Pool stats
                  </h3>
                </header>
                <ul className="grid gap-4 md:grid-cols-2">
                  {statsSummary.map((stat) => (
                    <li key={stat.label} className="grid gap-0.5">
                      <span className="text-gray-500 text-sm">
                        {stat.label}
                      </span>
                      <span className="text-gray-50 text-lg">{stat.value}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>
      </PageLayout>
    </MainLayout>
  );
};

const TokenBadge: FC<{ symbol: string; priceUsd: number }> = ({
  symbol,
  priceUsd,
}) => {
  return (
    <div className="p-2 bg-sifgray-800 rounded-lg flex items-center gap-2 text-sm font-semibold">
      <AssetIcon symbol={symbol} network="sifchain" size="sm" />
      <span>~=</span>
      {formatNumberAsCurrency(priceUsd)}
    </div>
  );
};

export default PoolDetails;
