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

  if (isWhitelistedAccount.isSuccess && isWhitelistedAccount.data.isWhitelisted === true) {
    return (
      <div className="bg-gray-850 p-10 text-center text-gray-100">
        You account is not part of the private Margin Beta. Please reach out to Sifchain Community on Discord.
      </div>
    );
  }

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
