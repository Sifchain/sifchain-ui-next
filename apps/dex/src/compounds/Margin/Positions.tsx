import type { NextPage } from "next";

import Head from "next/head";

import OpenPositionsTable from "~/compounds/Margin/OpenPositionsTable";
import { useSifSignerAddress } from "~/hooks/useSifSigner";

const Positions: NextPage = () => {
  const walletAddress = useSifSignerAddress();

  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Positions</title>
      </Head>
      <section className="mt-4 border border-gold-800 rounded overflow-hidden">
        <OpenPositionsTable walletAddress={walletAddress.data ?? ""} />
      </section>
    </>
  );
};

export default Positions;
