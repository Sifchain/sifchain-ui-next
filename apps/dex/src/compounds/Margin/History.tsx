import type { NextPage } from "next";

import Head from "next/head";

import HistoryTable from "~/compounds/Margin/HistoryTable";
import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useMarginIsWhitelistedAccount } from "~/domains/margin/hooks/useMarginIsWhitelistedAccount";

const HistoryTab: NextPage = () => {
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
        <HistoryTable />
      </section>
    </>
  );
};

export default HistoryTab;
