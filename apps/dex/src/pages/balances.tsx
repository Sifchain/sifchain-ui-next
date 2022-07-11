import { Decimal } from "@cosmjs/math";
import {
  ArrowDownIcon,
  Button,
  Modal,
  PoolsIcon,
  SwapIcon,
} from "@sifchain/ui";
import SvgDotsVerticalIcon from "@sifchain/ui/src/components/icons/svgr/DotsVerticalIcon";
import clsx from "clsx";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ascend, descend, sort } from "ramda";
import { FC, useCallback, useMemo, useState } from "react";
import AssetIcon from "~/compounds/AssetIcon";
import ExportModal from "~/compounds/ExportModal";
import ImportModal from "~/compounds/ImportModal";
import {
  useBalancesStats,
  useBalancesWithPool,
} from "~/domains/bank/hooks/balances";

const Stat: FC<{ label: string; value: string }> = (props) => (
  <div className="flex-1 grid gap-1">
    <span className="opacity-80">{props.label}</span>
    <span className="font-semibold md:text-2xl">{props.value}</span>
  </div>
);

const TokenFigure = (props: {
  symbol: string;
  displaySymbol: string;
  network: string;
}) => {
  return (
    <figcaption className="flex items-center gap-4">
      <figure>
        <AssetIcon network="sifchain" symbol={props.symbol ?? ""} size="md" />
      </figure>
      <div>
        <h2 className="uppercase font-bold">{props.displaySymbol}</h2>
        <h3>{props.network}</h3>
      </div>
    </figcaption>
  );
};

const AssetsPage: NextPage = () => {
  const router = useRouter();
  const balances = useBalancesWithPool();
  const balancesStats = useBalancesStats();

  const [selectedDenom, setSelectedDenom] = useState<string | undefined>();
  const selectedBalance = useMemo(
    () => balances?.find((x) => x.denom === selectedDenom),
    [balances, selectedDenom],
  );

  const [[sortByOrder, sortByProperty], setSortBy] = useState<
    ["asc" | "desc", "token" | "available" | "balance" | "pooled" | undefined]
  >(["asc", undefined]);

  const sortedBalance = useMemo(() => {
    const sortFunc = sortByOrder === "asc" ? ascend : descend;
    switch (sortByProperty) {
      case "token":
        return sort(
          sortFunc((x) => x.displaySymbol ?? ""),
          balances,
        );
      case "available":
        return sort(
          sortFunc((x) => x.amount?.toFloatApproximation() ?? 0),
          balances,
        );
      case "balance":
        return sort(
          sortFunc(
            (x) =>
              x.amount
                ?.plus(
                  x.pooledAmount ?? Decimal.zero(x.amount.fractionalDigits),
                )
                .toFloatApproximation() ?? 0,
          ),
          balances,
        );
      case "pooled":
        return sort(
          sortFunc((x) => x.pooledAmount?.toFloatApproximation() ?? 0),
          balances,
        );
      case undefined:
      default:
        return balances;
    }
  }, [balances, sortByOrder, sortByProperty]);

  const stats = useMemo(() => {
    return [
      {
        label: "Available",
        value:
          balancesStats.data?.availableInUsdc
            .toFloatApproximation()
            .toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
            }) ?? "...",
      },
      {
        label: "Pooled",
        value:
          balancesStats.data?.pooledInUsdc
            .toFloatApproximation()
            .toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
            }) ?? "...",
      },
      {
        label: "Total",
        value:
          balancesStats.data?.totalInUsdc
            .toFloatApproximation()
            .toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
            }) ?? "...",
      },
    ];
  }, [
    balancesStats.data?.availableInUsdc,
    balancesStats.data?.pooledInUsdc,
    balancesStats.data?.totalInUsdc,
  ]);

  const actions = useMemo(
    () => [
      {
        label: "Import",
        Icon: ArrowDownIcon,
        href: (denom: string) =>
          `balances?action=import&denom=${encodeURIComponent(denom)}`,
      },
      {
        label: "Export",
        Icon: () => <ArrowDownIcon className="rotate-180" />,
        href: (denom: string) =>
          `balances?action=export&denom=${encodeURIComponent(denom)}`,
      },
      {
        label: "Pools",
        Icon: PoolsIcon,
        href: (denom: string) => `/pools?denom=${encodeURIComponent(denom)}`,
      },
      {
        label: "Swap",
        Icon: SwapIcon,
        href: (denom: string) => `/swap?fromDenom=${encodeURIComponent(denom)}`,
      },
    ],
    [],
  );

  return (
    <>
      <section className="flex-1 w-full bg-black p-6 md:py-12 md:px-24">
        <header className="mb-10 md:mb-12">
          <div className="flex items-center justify-between pb-6 md:pb-8">
            <h2 className="text-2xl font-bold text-white">Balances</h2>
            <Link href={`balances?action=import&denom=cusdc`}>
              <Button as="a">
                <ArrowDownIcon /> Import
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {stats.map((stat) => (
              <Stat key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </header>
        <div className="flex flex-col gap-4 md:hidden">
          {sortedBalance?.map((balance) => (
            <details
              key={balance.denom}
              className="[&[open]>summary>div>.marker]:rotate-180"
            >
              <summary className="flex justify-between items-center mb-2">
                <TokenFigure
                  symbol={balance.symbol ?? ""}
                  displaySymbol={balance.displaySymbol ?? ""}
                  network={balance.network ?? ""}
                />
                <div className="flex items-center gap-4">
                  <strong>
                    {(
                      balance.amount
                        ?.plus(
                          balance.pooledAmount ??
                            Decimal.zero(balance.amount.fractionalDigits),
                        )
                        .toFloatApproximation() ?? 0
                    ).toLocaleString(undefined, {
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
                    {(
                      balance.amount?.toFloatApproximation() ?? 0
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                    })}
                  </div>
                </div>
                <div className="flex-1">
                  <header className="opacity-80">Pooled</header>
                  <div>
                    {(balance.pooledAmount ?? Decimal.zero(0))
                      ?.toFloatApproximation()
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
        <table className="hidden w-full md:table">
          <thead className="text-left uppercase text-xs [&>th]:font-normal [&>th]:opacity-80 [&>th]:pb-6">
            {(["token", "available", "pooled", "balance"] as const).map((x) => (
              <th
                key={x}
                className="cursor-pointer select-none"
                onClick={() =>
                  setSortBy((y) => [
                    y[1] !== x ? "asc" : y[0] === "asc" ? "desc" : "asc",
                    x,
                  ])
                }
              >
                <div className="flex items-center gap-2">
                  {x}
                  <div className="text-[0.75em]">
                    <div
                      className={clsx("mb-[-0.75em]", {
                        "opacity-0":
                          sortByProperty === x && sortByOrder === "desc",
                      })}
                    >
                      ▲
                    </div>
                    <div
                      className={clsx({
                        "opacity-0":
                          sortByProperty === x && sortByOrder === "asc",
                      })}
                    >
                      ▼
                    </div>
                  </div>
                </div>
              </th>
            ))}
          </thead>
          <tbody>
            {sortedBalance.map((balance) => (
              <tr key={balance.denom} className="[&>td]:pb-2">
                <td>
                  <TokenFigure
                    symbol={balance.symbol ?? ""}
                    displaySymbol={balance.displaySymbol ?? ""}
                    network={balance.network ?? ""}
                  />
                </td>
                <td>
                  {(balance.amount?.toFloatApproximation() ?? 0).toLocaleString(
                    undefined,
                    {
                      maximumFractionDigits: 6,
                    },
                  )}
                </td>
                <td>
                  {(balance.pooledAmount ?? Decimal.zero(0))
                    ?.toFloatApproximation()
                    .toLocaleString(undefined, {
                      maximumFractionDigits: 6,
                    })}
                </td>
                <td>
                  {(
                    balance.amount
                      ?.plus(
                        balance.pooledAmount ??
                          Decimal.zero(balance.amount.fractionalDigits),
                      )
                      .toFloatApproximation() ?? 0
                  ).toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}
                </td>
                <td className="w-0">
                  <div className="flex gap-3">
                    {actions.map(({ label, href }, index) => (
                      <Link key={index} href={href(balance.denom)}>
                        <a className="flex-1 text-center h-full px-4 py-3 rounded first:bg-gray-750 hover:bg-gray-700">
                          <span>{label}</span>
                        </a>
                      </Link>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <Modal
        title={selectedBalance?.displaySymbol?.toUpperCase()}
        isOpen={selectedDenom !== undefined}
        onClose={useCallback(() => setSelectedDenom(undefined), [])}
      >
        {actions.map(({ label, Icon, href }, index) => (
          <Link key={index} href={href(selectedDenom ?? "")}>
            <a className="flex items-center gap-2 w-full px-2 py-3 rounded hover:bg-gray-700">
              <Icon />
              <span>{label}</span>
            </a>
          </Link>
        ))}
      </Modal>
      <ImportModal
        denom={router.query["denom"]?.toString() ?? ""}
        isOpen={router.query["action"] === "import"}
        onClose={useCallback(() => router.back(), [router])}
        onRequestDenomChange={useCallback(
          (denom) =>
            router.replace(
              `balances?action=import&denom=${encodeURIComponent(denom ?? "")}`,
            ),
          [router],
        )}
      />
      <ExportModal
        denom={router.query["denom"]?.toString() ?? ""}
        isOpen={router.query["action"] === "export"}
        onClose={useCallback(() => router.back(), [router])}
      />
    </>
  );
};

export default AssetsPage;
