import type { NextPage } from "next";

import Head from "next/head";

import OpenPositionsTable from "~/compounds/Margin/OpenPositionsTable";

const PortfolioTab: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Positions</title>
      </Head>
      <section className="mt-4 border border-gold-800 rounded overflow-hidden">
        <OpenPositionsTable />
      </section>
    </>
  );
};

export default PortfolioTab;
