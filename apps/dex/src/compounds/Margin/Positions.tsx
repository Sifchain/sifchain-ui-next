import type { NextPage } from "next";

import Head from "next/head";

import OpenPositionsTable from "~/compounds/Margin/OpenPositionsTable";
import { useOpenPositionsQuery } from "~/domains/margin/hooks";

const PortfolioTab: NextPage = () => {
  const openPositionsQuery = useOpenPositionsQuery();
  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Positions</title>
      </Head>
      <section className="border-gold-800 mt-4 overflow-hidden rounded border">
        <OpenPositionsTable openPositionsQuery={openPositionsQuery} />
      </section>
    </>
  );
};

export default PortfolioTab;
