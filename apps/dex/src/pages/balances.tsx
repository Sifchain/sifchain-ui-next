import { ArrowDownIcon, Button } from "@sifchain/ui";
import SvgDotsVerticalIcon from "@sifchain/ui/src/components/icons/svgr/DotsVerticalIcon";
import type { NextPage } from "next";
import type { FC } from "react";
import AssetIcon from "~/compounds/AssetIcon";
import { useAllBalances } from "~/domains/bank/hooks/balances";

const Stat: FC<{ label: string; value: string }> = (props) => (
  <div className="flex-1 grid gap-1">
    <span className="opacity-80">{props.label}</span>
    <span className="font-semibold">{props.value}</span>
  </div>
);
const AssetsPage: NextPage = () => {
  const { data: balances } = useAllBalances();

  const stats = [
    {
      label: "Total",
      value: 100000,
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

  return (
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
          {balances?.map((balance) => (
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
                      .toFloatApproximation()
                      .toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </strong>
                  <span className="marker p-2 cursor-pointer select-none">
                    ▼
                  </span>
                  <button className="p-2">
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
                      .toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </div>
                </div>
                <div className="flex-1">
                  <header className="opacity-80">Pooled</header>
                  <div>
                    {balance.amount
                      .toFloatApproximation()
                      .toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AssetsPage;
