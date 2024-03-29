import type { NextPage } from "next";

import Head from "next/head";

import OpenPositionsTable from "~/compounds/Margin/OpenPositionsTable";
import { useMarginOpenPositionsQuery } from "~/domains/margin/hooks";

const PositionTab: NextPage = () => {
  const openPositionsQuery = useMarginOpenPositionsQuery();
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

export default PositionTab;
