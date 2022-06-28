import { Menu, Popover } from "@headlessui/react";
import clsx from "clsx";
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import tw from "tailwind-styled-components";
import WalletConnectQRCodeModal from "walletconnect-qrcode-modal";

import {
  AppearTransition,
  ArrowLeftIcon,
  Button,
  ChevronDownIcon,
  DotsVerticalIcon,
  ExternalLinkIcon,
  Identicon,
  LogoutIcon,
  Modal,
  PlusIcon,
  QrcodeIcon,
  SearchInput,
  SurfaceA,
  Tooltip,
  WalletIcon,
} from "../../components";
import { useCopyToClipboard } from "../../hooks";
import { maskWalletAddress } from "../../utils";

export type ChainEntry = {
  id: string;
  name: string;
  type: string;
  icon: ReactNode;
  connected?: boolean;
};

export type WalletEntry = {
  id: string;
  name: string;
  icon: ReactNode;
  type: string;
  isConnected?: boolean;
  account?: string;
};

export type WalletSelectorProps = {
  chains: ChainEntry[];
  wallets: WalletEntry[];
  isLoading?: boolean;
  selectedWalletId?: string;
  selectedChainId?: string;
  accounts: {
    [chainId: string]: string[];
  };
  onConnect?: (selection: { chainId: string; walletId: string }) => void;
  onDisconnect?: (selection: { chainId: string; walletId: string }) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
};

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

  const goBack = useCallback(() => {
    switch (step) {
      case "choose-network":
        setIsModalOpen(false);
        setNetworkId("");
        setWalletId("");
        setSearch("");
        setStep("choose-network");
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
                .filter((x) => x.name.toLowerCase().includes(search))
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
                    onClick={() => {
                      setWalletId(x.id);
                      props.onConnect?.({
                        chainId: networkId ?? "",
                        walletId: x.id,
                      });
                      navigate("await-confirmation");
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      <figure className="text-lg">{x.icon}</figure>
                      {x.name}{" "}
                      {x.isConnected && (
                        <Tooltip content={x.account || "no account"}>
                          <div>
                            <WalletIcon className="text-green-600" />
                          </div>
                        </Tooltip>
                      )}
                    </div>
                    <ArrowLeftIcon className="rotate-180 text-gray-400" />
                  </ListItem>
                ))}
            </ListContainer>
          </>,
          2,
        ];
      case "await-confirmation":
        if (!props.isLoading) {
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
        />
      ) : (
        <Button
          disabled={isModalOpen}
          onClick={setIsModalOpen.bind(null, true)}
          className="w-full max-w-xs"
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
      >
        {content}
      </Modal>
    </>
  );
};

export type ConnectedWalletsProps = {
  isModalOpen: boolean;
  accounts: [chainId: string, accounts: string[]][];
  chains: ChainEntry[];
  onDisconnect: WalletSelectorProps["onDisconnect"];
  onConnectAnotherWallet(): void;
};

const ConnectedWallets: FC<ConnectedWalletsProps> = (props) => {
  return (
    <Popover>
      <Popover.Button
        disabled={props.isModalOpen}
        as={Button}
        className="flex justify-between flex-1 items-center"
        variant="outline"
      >
        <span>Connected wallets</span>
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 bg-gray-600 rounded-full grid place-items-center">
            {props.accounts.length}
          </span>
          <ChevronDownIcon aria-hidden />
        </div>
      </Popover.Button>
      <AppearTransition>
        <Popover.Panel
          as={SurfaceA}
          className="absolute z-10 top-[74px] w-[350px] right-2.5 min-w-max grid gap-4"
        >
          <ul className="grid gap-1">
            {props.accounts.map(([chainId, accounts]) => (
              <ConnectedAccount
                key={chainId}
                accounts={accounts}
                chainId={chainId}
                chainName={
                  props.chains.find((x) => x.id === chainId)?.name ?? chainId
                }
                walletId={""}
                onDisconnect={props.onDisconnect}
              />
            ))}
          </ul>
          <hr className="border-gray-500" aria-hidden />
          <Button
            disabled={props.isModalOpen}
            variant="secondary"
            onClick={props.onConnectAnotherWallet}
            className="w-full max-w-xs"
          >
            <PlusIcon /> Connect another wallet
          </Button>
        </Popover.Panel>
      </AppearTransition>
    </Popover>
  );
};

type OverflowAction = {
  kind: "copy-address" | "show-qr-code" | "connect-another" | "disconnect";
  label: string;
  icon: JSX.Element;
};

function useOverflowActions(options: {
  chainId: string;
  account: string;
  onDisconnect: () => void;
}) {
  const actions: OverflowAction[] = [
    {
      kind: "copy-address",
      label: "Copy address",
      icon: <PlusIcon />,
    },
    {
      kind: "show-qr-code",
      label: "Show QR Code",
      icon: <QrcodeIcon />,
    },
    {
      kind: "connect-another",
      label: "Connect another wallet",
      icon: <ExternalLinkIcon />,
    },
    {
      kind: "disconnect",
      label: "Disconnect wallet",
      icon: <LogoutIcon />,
    },
  ];

  const [isCopied, setIsCopied] = useState(false);

  const [, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    let timeoutId = -1;
    if (isCopied) {
      timeoutId = window.setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isCopied]);

  const handleAction = async (action: OverflowAction) => {
    switch (action.kind) {
      case "copy-address":
        await copyToClipboard(options.account);
        setIsCopied(true);

        break;
      case "show-qr-code":
        WalletConnectQRCodeModal.open(options.account);

        const wcText = document.getElementById("walletconnect-qrcode-text");

        if (wcText) {
          // @ts-ignore
          wcText.style = "";
          wcText.className = "font-sans font-semibold mt-8";
          wcText.innerText = "Scan QR code to view address";
        }

        // hide wc logo
        document
          .querySelectorAll("#walletconnect-qrcode-modal img")
          .forEach((el) => {
            el.remove();
          });
        break;
      case "disconnect":
        options.onDisconnect();
        break;
    }
  };

  return [actions, handleAction, isCopied] as const;
}

const ConnectedAccount: FC<{
  chainId: string;
  chainName: string;
  walletId: string;
  accounts: string[];
  onDisconnect: ConnectedWalletsProps["onDisconnect"];
}> = ({ chainId, chainName, walletId, accounts, onDisconnect }) => {
  const [actions, handleAction, isCopied] = useOverflowActions({
    chainId,
    account: accounts[0] as string,
    onDisconnect: () => onDisconnect?.({ chainId, walletId }),
  });

  return (
    <li
      role="button"
      className="flex items-center justify-between p-2 hover:bg-gray-750 rounded"
    >
      <Menu as="div" className="relative w-full grid">
        {({ open }) => (
          <>
            <Menu.Button className="flex items-center justify-between">
              <div className="flex gap-2.5 items-center w-full">
                <Identicon diameter={32} address={accounts[0] ?? ""} />
                <div className="grid gap-1 flex-1 text-left">
                  <div>{maskWalletAddress(accounts[0] ?? "")}</div>
                  <div className="text-xs">{chainName}</div>
                </div>
              </div>
              <div
                className={clsx("", {
                  "ring-1 ring-gray-50 ring-offset-gray-800 rounded-full ring-offset-4 bg-gray-700":
                    open,
                })}
              >
                <DotsVerticalIcon className="h-4 w-4" />
              </div>
            </Menu.Button>
            <AppearTransition>
              <Menu.Items
                as={SurfaceA}
                className="absolute -right-2 top-10 p-2 grid gap-2 z-20"
              >
                {actions.map((action) => {
                  const copied = isCopied && action.kind === "copy-address";

                  return (
                    <Menu.Item
                      key={action.kind}
                      as={Button}
                      className="w-full min-w-max overflow-hidden bg-transparent flex items-center justify-start"
                      variant="secondary"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        e.stopPropagation();

                        handleAction(action);
                      }}
                    >
                      <figure className="mr-2">{action.icon}</figure>

                      {copied ? "Copied ✓" : action.label}
                    </Menu.Item>
                  );
                })}
              </Menu.Items>
            </AppearTransition>
          </>
        )}
      </Menu>
    </li>
  );
};
