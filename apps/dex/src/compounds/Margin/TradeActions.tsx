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

type TradeActionsProps = PropsWithChildren<{
  govParams: Exclude<Exclude<ReturnType<typeof useMarginParamsQuery>["data"], undefined>["params"], undefined>;
  onClickReset: (event: SyntheticEvent<HTMLButtonElement>) => void;
  isDisabledOpenPosition: boolean;
  onClickOpenPosition: (event: SyntheticEvent<HTMLButtonElement>) => void;
  isLoadingOpenPosition: boolean;
}>;

export function TradeActions({
  govParams,
  onClickReset,
  isDisabledOpenPosition,
  onClickOpenPosition,
  isLoadingOpenPosition,
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

      {isLoadingOpenPosition ? (
        <p className="col-span-3 rounded bg-indigo-200 py-3 px-4 text-center text-indigo-800">Opening trade...</p>
      ) : (
        <Button
          variant="primary"
          as="button"
          size="md"
          className="col-span-3"
          disabled={isDisabledOpenPosition || isLoadingOpenPosition}
          onClick={onClickOpenPosition}
        >
          Open trade
        </Button>
      )}
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
    console.group("Trade Actions Query Error");
    console.log({ walletAddressQuery });
    console.groupEnd();
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

  console.group("Trade Actions Missing State Error");
  console.log({
    govParams,
    walletAddressQuery,
    isWhitelistedAccountQuery,
  });
  console.groupEnd();
  return (
    <Layout>
      <span className="col-span-4">MISSING_STATE_ACTIONS_OPEN_TRADE</span>
    </Layout>
  );
}
