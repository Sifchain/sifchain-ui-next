import type { NextPage } from "next";

import Head from "next/head";

import { PortfolioTable } from "~/compounds/Margin/PortfolioTable";

const HARD_CODED_ADDRES_DS = "sif19z5atv2m8rz970l09th0vhhxjmnq0zrrfe4650";

const Portfolio: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Portfolio</title>
      </Head>
      <section className="mt-4 border border-gold-800 rounded overflow-hidden">
        <PortfolioTable queryId={HARD_CODED_ADDRES_DS} />
      </section>
    </>
  );
};

export default Portfolio;
