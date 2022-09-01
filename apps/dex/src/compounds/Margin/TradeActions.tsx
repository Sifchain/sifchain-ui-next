import type { PropsWithChildren, SyntheticEvent } from "react";

import { Button } from "@sifchain/ui";

import { useSifSignerAddressQuery } from "~/hooks/useSifSigner";

import { useMarginIsWhitelistedAccountQuery } from "~/domains/margin/hooks/useMarginIsWhitelistedAccountQuery";
import type { useMarginParamsQuery } from "~/domains/margin/hooks";

import {
  FlashMessageConnectSifChainWallet,
  FlashMessageConnectSifChainWalletError,
  FlashMessageConnectSifChainWalletLoading,
  FlashMessageLoading,
  FlashMessageAccountNotWhitelisted,
} from "@sifchain/ui";

type TradeActionsProps = {
  govParams: Exclude<Exclude<ReturnType<typeof useMarginParamsQuery>["data"], undefined>["params"], undefined>;
  onClickReset: (event: SyntheticEvent<HTMLButtonElement>) => void;
  isDisabledOpenPosition: boolean;
  onClickOpenPosition: (event: SyntheticEvent<HTMLButtonElement>) => void;
};
export function TradeActions({
  govParams,
  onClickReset,
  isDisabledOpenPosition,
  onClickOpenPosition,
}: TradeActionsProps) {
  const walletAddressQuery = useSifSignerAddressQuery();
  const isWhitelistedAccountQuery = useMarginIsWhitelistedAccountQuery({
    walletAddress: walletAddressQuery.data ?? "",
  });
  const Layout = ({ children }: PropsWithChildren) => {
    return <div className="mt-4 grid grid-cols-4 gap-2 px-4 pb-4">{children}</div>;
  };
  const ActionButtons = () => (
    <>
      <Button
        variant="tertiary"
        as="button"
        size="xs"
        className="self-center font-normal text-gray-300"
        onClick={onClickReset}
      >
        Reset
      </Button>
      <Button
        variant="primary"
        as="button"
        size="md"
        className="col-span-3"
        disabled={isDisabledOpenPosition}
        onClick={onClickOpenPosition}
      >
        Open trade
      </Button>
    </>
  );

  /**
   * Wallet address scenarios
   * This is linekd with WalletConnector / Keplr behaviour
   */
  if (walletAddressQuery.fetchStatus === "idle" && walletAddressQuery.isLoading) {
    return (
      <Layout>
        <FlashMessageConnectSifChainWallet className="col-span-4" />
      </Layout>
    );
  }

  if (walletAddressQuery.fetchStatus === "idle" && walletAddressQuery.isError) {
    console.log({
      walletAddressQueryError: walletAddressQuery.error,
    });
    return (
      <Layout>
        <FlashMessageConnectSifChainWalletError className="col-span-4" />
      </Layout>
    );
  }

  if (walletAddressQuery.isFetching && walletAddressQuery.isLoading) {
    return (
      <Layout>
        <FlashMessageConnectSifChainWalletLoading className="col-span-4" />
      </Layout>
    );
  }

  /**
   * When whitelisting is not enable, skip all checks and return early
   */
  if (govParams.whitelistingEnabled === false) {
    return (
      <Layout>
        <ActionButtons />
      </Layout>
    );
  }

  /**
   * GovParams scenarios
   * They can be changed in the chain config
   */
  if (isWhitelistedAccountQuery.isLoading) {
    return (
      <Layout>
        <FlashMessageLoading className="col-span-4" />
      </Layout>
    );
  }

  if (isWhitelistedAccountQuery.isSuccess) {
    if (isWhitelistedAccountQuery.data.isWhitelisted === false) {
      return (
        <Layout>
          <FlashMessageAccountNotWhitelisted className="col-span-4" />
        </Layout>
      );
    }

    if (isWhitelistedAccountQuery.data.isWhitelisted === true) {
      return (
        <Layout>
          <ActionButtons />
        </Layout>
      );
    }
  }

  return (
    <Layout>
      <span className="col-span-4">MISSING_SCENARIO_ACTIONS_OPEN_TRADE</span>
    </Layout>
  );
}
