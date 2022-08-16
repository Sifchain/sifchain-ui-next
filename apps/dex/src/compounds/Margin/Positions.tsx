import type { NextPage } from "next";

import Head from "next/head";

import OpenPositionsTable from "~/compounds/Margin/OpenPositionsTable";
import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useMarginIsWhitelistedAccount } from "~/domains/margin/hooks/useMarginIsWhitelistedAccount";

const PortfolioTab: NextPage = () => {
  const walletAddress = useSifSignerAddress();
  const isWhitelistedAccount = useMarginIsWhitelistedAccount({
    walletAddress: walletAddress.data ?? "",
  });

  if ([isWhitelistedAccount].some((query) => query.isError)) {
    return <div className="bg-gray-850 p-10 text-center text-gray-100">Try again later.</div>;
  }

  if (isWhitelistedAccount.isSuccess && isWhitelistedAccount.data.isWhitelisted === false) {
    return (
      <div className="bg-gray-850 p-10 text-center text-gray-100">
        <span className="mr-1">
          You account is not part of the private Margin Beta. Please reach out to Sifchain Community on
        </span>
        <a
          className="text-blue-300 underline hover:text-blue-400"
          href="https://discord.gg/sifchain"
          rel="noopener noreferrer"
        >
          Discord.
        </a>
      </div>
    );
  }

  if (isWhitelistedAccount.isSuccess && isWhitelistedAccount.data.isWhitelisted === true) {
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
  }

  return <div className="bg-gray-850 p-10 text-center text-gray-100">Loading...</div>;
};

export default PortfolioTab;
