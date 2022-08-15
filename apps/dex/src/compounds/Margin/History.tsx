import type { NextPage } from "next";

import Head from "next/head";

import HistoryTable from "~/compounds/Margin/HistoryTable";
import { useSifSignerAddress } from "~/hooks/useSifSigner";

const History: NextPage = () => {
  const walletAddress = useSifSignerAddress();

  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Positions</title>
      </Head>
      <section className="mt-4 border border-gold-800 rounded overflow-hidden">
        <HistoryTable walletAddress={walletAddress.data ?? ""} />
      </section>
    </>
  );
};

export default History;
