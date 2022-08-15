import type { NextPage } from "next";

import Head from "next/head";

import HistoryTable from "~/compounds/Margin/HistoryTable";

const HistoryTab: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Positions</title>
      </Head>
      <section className="mt-4 border border-gold-800 rounded overflow-hidden">
        <HistoryTable />
      </section>
    </>
  );
};

export default HistoryTab;
