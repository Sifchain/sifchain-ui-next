import type { NextPage } from "next";
import type { FC } from "react";
import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const Stat: FC<{ label: string; value: string }> = (props) => (
  <div className="grid gap-2">
    <span className="text-gray-300">{props.label}</span>
    <span className="text-2xl font-semibold">{props.value}</span>
  </div>
);

const AssetsPage: NextPage = () => {
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
    <MainLayout title="Balances">
      <PageLayout heading="Balances">
        <section className="grid gap-4 max-w-2xl">
          <h2 className="text-2xl">Balances</h2>
          <div className="flex justify-between">
            {stats.map((stat) => (
              <Stat key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </section>
      </PageLayout>
    </MainLayout>
  );
};

export default AssetsPage;
