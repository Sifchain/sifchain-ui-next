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
  nativeAssetBalance: string;
  nativeAssetSymbol: string;
  onDisconnect(): void;
  onConnectAnotherWallet(): void;
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
          document
            .querySelectorAll("#walletconnect-qrcode-modal img")
            .forEach((el) => {
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
    <li
      role="button"
      className="flex items-center justify-between p-2 transition-colors hover:bg-gray-750 rounded"
    >
      <Menu as="div" className="relative w-full grid">
        {({ open }) => (
          <>
            <Menu.Button className="flex items-center justify-between">
              <div className="flex gap-2.5 items-center w-full">
                <Identicon diameter={32} address={account} />
                <div className="grid gap-1 flex-1 text-left">
                  <div className="text-gray-200">
                    {maskWalletAddress(account)}
                  </div>
                  <div className="text-xs text-gray-300">{props.chainName}</div>
                </div>
              </div>
              <div className="grid gap-1 pr-4 text-right">
                {props.nativeAssetDollarValue && (
                  <span className="text-sm text-gray-200 font-semibold">
                    {props.nativeAssetDollarValue}
                  </span>
                )}
                <span className="text-xs text-gray-300">
                  {props.nativeAssetBalance} {props.nativeAssetSymbol}
                </span>
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
