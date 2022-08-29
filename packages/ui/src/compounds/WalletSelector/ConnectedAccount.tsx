import { Menu } from "@headlessui/react";
import clsx from "clsx";
import React, { FC, useEffect, useState } from "react";
import WalletConnectQRCodeModal from "walletconnect-qrcode-modal";

import {
  AppearTransition,
  Button,
  DotsVerticalIcon,
  ExternalLinkIcon,
  Identicon,
  LogoutIcon,
  PlusIcon,
  QrcodeIcon,
  SurfaceA,
} from "../../components";
import { useCopyToClipboard } from "../../hooks";
import { maskWalletAddress } from "../../utils";

export type ConnectedAccountProps = {
  chainId: string;
  networkId: string;
  chainType: string;
  chainName: string;
  account: string;
  nativeAssetDollarValue?: string;
  nativeAssetBalance?: string;
  nativeAssetSymbol?: string;
  onDisconnect(this: void): void;
  onConnectAnotherWallet(this: void): void;
};

type OverflowAction = {
  kind: "copy-address" | "show-qr-code" | "connect-another" | "disconnect";
  label: string;
  icon: JSX.Element;
};

function useOverflowActions(options: {
  chainId: string;
  account: string;
  onDisconnect(): void;
  onConnectAnotherWallet(): void;
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
        {
          WalletConnectQRCodeModal.open(options.account);

          const wcText = document.getElementById("walletconnect-qrcode-text");

          if (wcText) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            wcText.style = "";
            wcText.className = "font-sans font-semibold mt-8";
            wcText.innerText = "Scan QR code to view address";
          }

          // hide wc logo
          document.querySelectorAll("#walletconnect-qrcode-modal img").forEach((el) => {
            el.remove();
          });
        }
        break;
      case "connect-another":
        options.onConnectAnotherWallet();
        break;
      case "disconnect":
        options.onDisconnect();
        break;
    }
  };

  return [actions, handleAction, isCopied] as const;
}

export const ConnectedAccount: FC<ConnectedAccountProps> = (props) => {
  const account = props.account;

  const [actions, handleAction, isCopied] = useOverflowActions({
    account,
    chainId: props.chainId,
    onDisconnect: props.onDisconnect,
    onConnectAnotherWallet: props.onConnectAnotherWallet,
  });

  return (
    <li role="button" className="hover:bg-gray-750 flex items-center justify-between rounded p-2 transition-colors">
      <Menu as="div" className="relative grid w-full">
        {({ open }) => (
          <>
            <Menu.Button className="flex items-center justify-between">
              <div className="flex w-full items-center gap-2.5">
                <Identicon diameter={32} address={account} />
                <div className="grid flex-1 gap-1 text-left">
                  <div className="text-gray-200">{maskWalletAddress(account)}</div>
                  <div className="text-xs text-gray-300">{props.chainName}</div>
                </div>
              </div>
              <div className="grid gap-1 pr-4 text-right">
                {props.nativeAssetDollarValue && (
                  <span className="text-sm font-semibold text-gray-200">{props.nativeAssetDollarValue}</span>
                )}
                <span className="whitespace-nowrap text-xs text-gray-300">
                  {props.nativeAssetBalance} {props.nativeAssetSymbol}
                </span>
              </div>
              <div
                className={clsx("", {
                  "rounded-full bg-gray-700 ring-1 ring-gray-50 ring-offset-4 ring-offset-gray-800": open,
                })}
              >
                <DotsVerticalIcon className="h-4 w-4" />
              </div>
            </Menu.Button>
            <AppearTransition>
              <Menu.Items as={SurfaceA} className="absolute -right-2 top-10 z-20 grid gap-2 p-2">
                {actions.map((action) => {
                  const copied = isCopied && action.kind === "copy-address";

                  return (
                    <Menu.Item
                      key={action.kind}
                      as={Button}
                      className="flex w-full min-w-max items-center justify-start overflow-hidden bg-transparent"
                      variant="secondary"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        e.stopPropagation();

                        void handleAction(action);
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
