import type { NextPage } from "next";

import Head from "next/head";

import { PortfolioTable } from "~/compounds/Margin/PortfolioTable";

const Portfolio: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Portfolio</title>
      </Head>
      <section className="mt-4 border border-gold-800 rounded overflow-hidden">
        <PortfolioTable queryId="SomeUserIdOrAddress" />
      </section>
    </>
  );
};

export default Portfolio;
