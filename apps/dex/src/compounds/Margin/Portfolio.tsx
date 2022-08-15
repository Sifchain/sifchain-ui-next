import type { NextPage } from "next";

import Head from "next/head";

import { PortfolioTable } from "~/compounds/Margin/PortfolioTable";
import { useSifSignerAddress } from "~/hooks/useSifSigner";

const Portfolio: NextPage = () => {
  const walletAddress = useSifSignerAddress();

  return (
    <>
      <Head>
        <title>Sichain Dex - Margin - Portfolio</title>
      </Head>
      <section className="mt-4 overflow-hidden rounded border border-gold-800">
        {walletAddress.isLoading && (
          <div className="bg-gray-850 p-10 text-center text-gray-100">
            Loading...
          </div>
        )}
        {walletAddress.isSuccess && (
          <PortfolioTable walletAddress={walletAddress.data ?? ""} />
        )}
      </section>
    </>
  );
};

export default Portfolio;
