import type { NextPage } from "next";

import Head from "next/head";

import { PortfolioTable } from "~/compounds/Margin/PortfolioTable";

import { createOpenPositionsRow, createHistoryRow } from "./mockdata";

const Portfolio: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Portfolio</title>
      </Head>
      <section className="mt-4 border border-gold-800 rounded overflow-hidden">
        <PortfolioTable
          openPositions={{
            rows: Array.from({ length: 10 }, () => createOpenPositionsRow()),
            hideCols: ["unsettledInterest", "nextPayment", "paidInterest"],
          }}
          history={{
            rows: Array.from({ length: 10 }, () => createHistoryRow()),
          }}
        />
      </section>
    </>
  );
};

export default Portfolio;
