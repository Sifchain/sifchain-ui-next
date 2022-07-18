import { FC, useCallback, useMemo, useState } from "react";
import tw from "tailwind-styled-components";

import {
  ArrowLeftIcon,
  Button,
  Modal,
  SearchInput,
  WalletIcon,
} from "../../components";
import {
  ConnectedWallets,
  type RenderConnectedAccount,
  type ConnectedWalletsProps,
} from "./ConnectedWallets";
import type { ChainEntry, WalletEntry } from "./types";

export type WalletSelectorStep =
  | "choose-network"
  | "choose-wallet"
  | "await-confirmation";

const ListContainer = tw.ul`
  grid gap-2 max-h-64 overflow-y-scroll -mx-3
`;

const ListItem = tw.li`
  flex items-center justify-between p-4 hover:opacity-60 rounded
`;

export type WalletSelectorProps = {
  chains: ChainEntry[];
  wallets: WalletEntry[];
  selectedWalletId?: string;
  selectedChainId?: string;
  accounts: {
    [chainId: string]: string[];
  };
  onConnect?: (selection: {
    chainId: string;
    walletId: string;
  }) => Promise<void>;
  onDisconnect?: ConnectedWalletsProps["onDisconnect"];
  onError?: (error: Error) => void;
  onCancel?: () => void;
  renderConnectedAccount?: RenderConnectedAccount;
};

export const WalletSelector: FC<WalletSelectorProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [networkId, setNetworkId] = useState<string>();
  const [walletId, setWalletId] = useState<string>();
  const [search, setSearch] = useState("");
  const [step, setStep] = useState<WalletSelectorStep>("choose-network");

  const navigate = useCallback((nextStep: WalletSelectorStep) => {
    setStep(nextStep);
    setSearch("");
  }, []);

  const resetState = useCallback(() => {
    setIsModalOpen(false);
    setNetworkId("");
    setWalletId("");
    setSearch("");
    setStep("choose-network");
  }, []);

  const goBack = useCallback(() => {
    switch (step) {
      case "choose-network":
        resetState();
        props.onCancel?.();
        return;
      case "choose-wallet":
        navigate("choose-network");
        return;
      case "await-confirmation":
        navigate("choose-wallet");
    }
  }, [step]);

  const selectedNetwork = useMemo(
    () => props.chains.find((x) => x.id === networkId),
    [networkId],
  );

  const selectedWallet = useMemo(
    () => props.wallets.find((x) => x.id === walletId),
    [walletId],
  );

  const [subHeading, content] = useMemo(() => {
    switch (step) {
      case "choose-network":
        return [
          <label className="flex justify-between items-center w-full">
            <span>Choose network</span>
            <SearchInput
              placeholder="Search network"
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
          </label>,
          <>
            <ListContainer>
              {props.chains
                .filter(
                  (x) =>
                    !(x.chainId in props.accounts) &&
                    !(x.id in props.accounts) &&
                    x.name.toLowerCase().includes(search),
                )
                .map((x) => (
                  <ListItem
                    key={x.id}
                    role="button"
                    onClick={() => {
                      setNetworkId(x.id);
                      navigate("choose-wallet");
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      <figure className="h-5 w-5">{x.icon}</figure>
                      {x.name}
                    </div>
                    <ArrowLeftIcon className="rotate-180 text-gray-400" />
                  </ListItem>
                ))}
            </ListContainer>
          </>,
        ];
      case "choose-wallet":
        return [
          <label className="flex justify-between items-center w-full">
            <span>Choose wallet</span>
            <SearchInput
              placeholder="Search wallet"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>,
          <>
            <ListContainer>
              {props.wallets
                .filter(
                  (x) =>
                    selectedNetwork?.type === x.type &&
                    x.name.toLowerCase().includes(search),
                )
                .map((x) => (
                  <ListItem
                    key={x.id}
                    role="button"
                    onClick={async () => {
                      setWalletId(x.id);
                      try {
                        await props.onConnect?.({
                          chainId: networkId ?? "",
                          walletId: x.id,
                        });
                      } catch (error) {
                        console.log("failed to connect", error);
                      }
                      navigate("await-confirmation");
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      <figure className="text-lg">{x.icon}</figure>
                      {x.name}{" "}
                    </div>
                    <ArrowLeftIcon className="rotate-180 text-gray-400" />
                  </ListItem>
                ))}
            </ListContainer>
          </>,
          2,
        ];
      case "await-confirmation":
        if (
          selectedNetwork &&
          (selectedNetwork.chainId in props.accounts ||
            selectedNetwork.id in props.accounts)
        ) {
          resetState();
          return [<></>, <></>];
        }
        return [
          <></>,
          <>
            <div className="grid place-items-center gap-4">
              <p>
                Connect {selectedWallet?.name} to {selectedNetwork?.name} to
                proceed
              </p>
              <Button
                onClick={() => {
                  props.onCancel?.();
                  setNetworkId("");
                  setSearch("");
                  setWalletId("");
                  setStep("choose-network");
                }}
              >
                Cancel
              </Button>
            </div>
          </>,
        ];
      default:
        return [<></>];
    }
  }, [
    step,
    search,
    props.chains,
    props.wallets,
    props.onConnect,
    props.onCancel,
  ]);

  const accountEntries = Object.entries(props.accounts).filter(
    ([, x]) => x.length,
  );

  return (
    <>
      {accountEntries.length ? (
        <ConnectedWallets
          accounts={accountEntries}
          chains={props.chains}
          isModalOpen={isModalOpen}
          onDisconnect={props.onDisconnect}
          onConnectAnotherWallet={setIsModalOpen.bind(null, true)}
          renderConnectedAccount={props.renderConnectedAccount}
        />
      ) : (
        <Button
          disabled={isModalOpen}
          onClick={setIsModalOpen.bind(null, true)}
          className="w-full whitespace-nowrap md:w-auto"
        >
          <WalletIcon className="-translate-y-0.5" /> Connect wallets
        </Button>
      )}
      <Modal
        title="Connect Wallet"
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        onGoBack={goBack}
        subTitle={subHeading}
        onTransitionEnd={resetState}
      >
        {content}
      </Modal>
    </>
  );
};
