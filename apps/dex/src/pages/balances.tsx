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
      <section className="grid gap-4 max-w-2xl">
        <h2 className="text-2xl">Balances</h2>
        <div className="flex justify-between">
          {stats.map((stat) => (
            <Stat key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
      </section>
      <section className="pt-16 flex flex-col gap-4">
        {balances?.map((x) => (
          <article key={x.denom}>
            <figcaption className="flex gap-4">
              <figure>
                <AssetIcon network="sifchain" symbol={x.denom!} size="md" />
              </figure>
              <h2>
                {x.denom}: {x.amount.toFormat()}
              </h2>
            </figcaption>
          </article>
        ))}
      </section>
    </PageLayout>
  );
};

export default AssetsPage;
