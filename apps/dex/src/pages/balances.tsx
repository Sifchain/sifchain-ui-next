import { SearchInput, SortUnderterminedIcon } from "@sifchain/ui";
import type { NextPage } from "next";
import type { FC } from "react";
import AssetIcon from "~/compounds/AssetIcon";
import { useAllDisplayBalances } from "~/domains/bank/hooks/balances";
import PageLayout from "~/layouts/PageLayout";

const Stat: FC<{ label: string; value: string }> = (props) => (
  <div className="grid gap-2">
    <span className="text-gray-300">{props.label}</span>
    <span className="text-2xl font-semibold">{props.value}</span>
  </div>
);

const COLUMNS = [
  {
    id: "token",
    label: "Token",
    sortable: true,
    sortField: "token",
  },
  {
    id: "balance",
    label: "Balance",
    sortable: true,
    sortField: "balance",
  },
  {
    id: "available",
    label: "Available",
    sortable: true,
    sortField: "available",
  },
  {
    id: "pooled",
    label: "Pooled",
    sortable: true,
    sortField: "pooled",
  },
];

const AssetsPage: NextPage = () => {
  const { data: balances } = useAllDisplayBalances();

  const stats = [
    {
      label: "Total Assets",
      value: "1,000,000",
    },
    {
      label: "Available Assets",
      value: "1,000,000",
    },
    {
      label: "Pooled Assets",
      value: "1,000,000",
    },
  ];

  return (
    <PageLayout heading="Balances">
      <section className="grid gap-12 rounded-xl bg-gray-900 p-8">
        <header className="grid gap-4">
          <div className="flex justify-between">
            <h2 className="text-2xl">Balances</h2>
            <SearchInput placeholder="filter tokens..." />
          </div>
          <div className="flex justify-between max-w-2xl">
            {stats.map((stat) => (
              <Stat key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </header>
        <table>
          <thead className="text-left mb-6">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.id} className="text-gray-300 py-4">
                  <div className="flex items-center gap-2">
                    {column.label} <SortUnderterminedIcon />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {balances?.map((balance) => (
              <tr key={balance.denom}>
                <td className="py-4">
                  <article>
                    <figcaption className="flex gap-4">
                      <figure>
                        <AssetIcon
                          network="sifchain"
                          symbol={balance.denom}
                          size="md"
                        />
                      </figure>
                      <h2>{balance.denom}</h2>
                    </figcaption>
                  </article>
                </td>
                <td className="py-4">{balance.amount.toFormat()}</td>
                <td className="py-4">{balance.amount.toFormat()}</td>
                <td className="py-4">{balance.amount.toFormat()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </PageLayout>
  );
};

export default AssetsPage;
