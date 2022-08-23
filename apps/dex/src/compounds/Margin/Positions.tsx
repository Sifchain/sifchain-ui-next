import type { NextPage } from "next";

import Head from "next/head";

import OpenPositionsTable from "~/compounds/Margin/OpenPositionsTable";

const PortfolioTab: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Positions</title>
      </Head>
      <section className="border-gold-800 mt-4 overflow-hidden rounded border">
        <OpenPositionsTable />
      </section>
    </>
  );
};

export default PortfolioTab;
