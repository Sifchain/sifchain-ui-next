import { Decimal } from "@cosmjs/math";
import {
  ArrowDownIcon,
  Button,
  Modal,
  PoolsIcon,
  SwapIcon,
} from "@sifchain/ui";
import SvgDotsVerticalIcon from "@sifchain/ui/src/components/icons/svgr/DotsVerticalIcon";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo, useState } from "react";
import AssetIcon from "~/compounds/AssetIcon";
import { useAllBalances } from "~/domains/bank/hooks/balances";
import { useLiquidityProviders } from "~/domains/clp";
import { useDexEnvironment } from "~/domains/core/envs";

const useBalancesWithPool = () => {
  const { data: liquidityProviders } = useLiquidityProviders();
  const { data: balances } = useAllBalances();

  const totalRowan = liquidityProviders?.pools.reduce(
    (prev, curr) => prev.plus(curr.nativeAssetBalance),
    Decimal.zero(18),
  );

  return {
    balances: useMemo(
      () =>
        balances?.map((x) => ({
          ...x,
          pool: liquidityProviders?.pools.find(
            (y) => y.liquidityProvider?.asset?.symbol === x.denom,
          ),
        })),
      [balances, liquidityProviders?.pools],
    ),
    totalRowan,
  };
};

const Stat: FC<{ label: string; value: string }> = (props) => (
  <div className="flex-1 grid gap-1">
    <span className="opacity-80">{props.label}</span>
    <span className="font-semibold">{props.value}</span>
  </div>
);

const AssetsPage: NextPage = () => {
  const router = useRouter();

  const { data: env } = useDexEnvironment();
  const { balances, totalRowan } = useBalancesWithPool();

  const [selectedDenom, setSelectedDenom] = useState<string | undefined>();
  const selectedBalance = useMemo(
    () => balances?.find((x) => x.denom === selectedDenom),
    [balances, selectedDenom],
  );

  const stats = useMemo(() => {
    return [
      {
        label: "Total",
        value: 10,
      },
      {
        label: "Available",
        value: 100000,
      },
      {
        label: "Pooled",
        value: 100000,
      },
    ];
  }, []);

  return (
    <>
      <div className="flex-1 flex flex-col justify-center items-center">
        <section className="flex-1 w-full bg-black p-6">
          <header className="mb-10">
            <div className="flex items-center justify-between pb-6">
              <h2 className="text-2xl font-bold text-white">Balances</h2>
              <Button>
                <ArrowDownIcon /> Import
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              {stats.map((stat) => (
                <Stat
                  key={stat.label}
                  label={stat.label}
                  value={stat.value.toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD",
                  })}
                />
              ))}
            </div>
          </header>
          <div className="flex flex-col gap-4">
            {balances?.map((balance) => {
              const pooledAmount =
                balance.denom === env?.nativeAsset.symbol
                  ? totalRowan
                  : balance.pool?.externalAssetBalance;

              return (
                <details
                  key={balance.denom}
                  className="[&[open]>summary>div>.marker]:rotate-180"
                >
                  <summary className="flex justify-between items-center mb-2">
                    <figcaption className="flex items-center gap-4">
                      <figure>
                        <AssetIcon
                          network="sifchain"
                          symbol={balance.symbol ?? ""}
                          size="md"
                        />
                      </figure>
                      <div>
                        <h2 className="uppercase font-bold">
                          {balance.displaySymbol}
                        </h2>
                        <h3>{balance.network}</h3>
                      </div>
                    </figcaption>
                    <div className="flex items-center gap-4">
                      <strong>
                        {balance.amount
                          .plus(
                            pooledAmount ??
                              Decimal.zero(balance.amount.fractionalDigits),
                          )
                          .toFloatApproximation()
                          .toLocaleString(undefined, {
                            maximumFractionDigits: 6,
                          })}
                      </strong>
                      <span className="marker p-2 cursor-pointer select-none">
                        ▼
                      </span>
                      <button
                        className="p-2"
                        onClick={() => setSelectedDenom(balance.denom)}
                      >
                        <SvgDotsVerticalIcon />
                      </button>
                    </div>
                  </summary>
                  <div className="flex pl-10">
                    <div className="flex-1">
                      <header className="opacity-80">Available</header>
                      <div>
                        {balance.amount
                          .toFloatApproximation()
                          .toLocaleString(undefined, {
                            maximumFractionDigits: 6,
                          })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <header className="opacity-80">Pooled</header>
                      <div>
                        {(pooledAmount ?? Decimal.zero(0))
                          ?.toFloatApproximation()
                          .toLocaleString(undefined, {
                            maximumFractionDigits: 6,
                          })}
                      </div>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      </div>
      <Modal
        title={selectedBalance?.displaySymbol?.toUpperCase()}
        isOpen={selectedDenom !== undefined}
        onClose={useCallback(() => setSelectedDenom(undefined), [])}
      >
        {[
          {
            label: "Import",
            Icon: ArrowDownIcon,
            href: `balances?action=import&denom=${encodeURIComponent(
              selectedBalance?.denom ?? "",
            )}`,
          },
          {
            label: "Export",
            Icon: () => <ArrowDownIcon className="rotate-180" />,
            href: `balances?action=export&denom=${encodeURIComponent(
              selectedBalance?.denom ?? "",
            )}`,
          },
          {
            label: "Pools",
            Icon: PoolsIcon,
            href: `/pools?denom=${encodeURIComponent(
              selectedBalance?.denom ?? "",
            )}`,
          },
          {
            label: "Swap",
            Icon: SwapIcon,
            href: `/swap?fromDenom=${encodeURIComponent(
              selectedBalance?.denom ?? "",
            )}`,
          },
        ].map(({ label, Icon, href }, index) => (
          <Link key={index} href={href}>
            <a className="flex items-center gap-2 w-full px-2 py-3 rounded hover:bg-gray-700">
              <Icon />
              <span>{label}</span>
            </a>
          </Link>
        ))}
      </Modal>
      <Modal
        title="Import"
        isOpen={router.query["action"] === "import"}
        onClose={() => router.back()}
      >
        <h1>Hello world</h1>
      </Modal>
      <Modal
        title="Export"
        isOpen={router.query["action"] === "export"}
        onClose={() => router.back()}
      >
        <h1>Hello world</h1>
      </Modal>
    </>
  );
};

export default AssetsPage;
