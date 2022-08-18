import type { NextPage } from "next";

import Head from "next/head";

import OpenPositionsTable from "~/compounds/Margin/OpenPositionsTable";
import { useSifSignerAddress } from "~/hooks/useSifSigner";
import { useMarginIsWhitelistedAccount } from "~/domains/margin/hooks/useMarginIsWhitelistedAccount";
import {
  FlashMessageLoading,
  FlashMessage5xxError,
  FlashMessageAccountNotWhitelisted,
  FlashMessageConnectSifChainWallet,
} from "./_components";

const PortfolioTab: NextPage = () => {
  const walletAddress = useSifSignerAddress();
  const isWhitelistedAccount = useMarginIsWhitelistedAccount({
    walletAddress: walletAddress.data ?? "",
  });

  if ([isWhitelistedAccount].some((query) => query.isError)) {
    return <FlashMessage5xxError />;
  }

  if (!isWhitelistedAccount.data) {
    return <FlashMessageConnectSifChainWallet />;
  }

  if (isWhitelistedAccount.data && isWhitelistedAccount.data.isWhitelisted === false) {
    return <FlashMessageAccountNotWhitelisted />;
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

  return <FlashMessageLoading />;
};

export default PortfolioTab;
