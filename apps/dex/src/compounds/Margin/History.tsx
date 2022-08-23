import type { NextPage } from "next";

import Head from "next/head";

import HistoryTable from "~/compounds/Margin/HistoryTable";

const HistoryTab: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Positions</title>
      </Head>
      <section className="border-gold-800 mt-4 overflow-hidden rounded border">
        <HistoryTable />
      </section>
    </>
  );
};

export default HistoryTab;
