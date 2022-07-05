import { Popover } from "@headlessui/react";
import type { FC } from "react";

import {
  AppearTransition,
  Button,
  ChevronDownIcon,
  PlusIcon,
  SurfaceA,
} from "../../components";
import { ConnectedAccount, ConnectedAccountProps } from "./ConnectedAccount";
import type { ChainEntry } from "./types";

export type RenderConnectedAccount = FC<ConnectedAccountProps>;

export type ConnectedWalletsProps = {
  isModalOpen: boolean;
  accounts: [chainId: string, accounts: string[]][];
  chains: ChainEntry[];
  onConnectAnotherWallet(): void;
  onDisconnect?: ((selection: { chainId: string }) => void) | undefined;
  renderConnectedAccount?: RenderConnectedAccount | undefined;
};

export const ConnectedWallets: FC<ConnectedWalletsProps> = (props) => {
  return (
    <Popover>
      <Popover.Button
        disabled={props.isModalOpen}
        as={Button}
        className="flex justify-between flex-1 items-center"
        variant="outline"
      >
        <span className="text-white">Connected wallets</span>
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 bg-gray-600 text-gray-50 rounded-full grid place-items-center">
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
            {props.accounts.map(([chainId, accounts]) => {
              const chain = props.chains.find((x) => x.id === chainId);

              const connectedAccountProps: ConnectedAccountProps = {
                account: accounts[0] ?? "",
                chainId: chainId,
                chainName: chain?.name ?? chainId,
                nativeAssetSymbol: "ETH",
                nativeAssetBalance: "0",
                nativeAssetDollarValue: "$2,000",
                onDisconnect: () => props.onDisconnect?.({ chainId }),
                onConnectAnotherWallet: props.onConnectAnotherWallet,
              };

              const ConnectedAccountComponent =
                props.renderConnectedAccount ?? ConnectedAccount;

              return (
                <ConnectedAccountComponent
                  key={chainId}
                  {...connectedAccountProps}
                />
              );
            })}
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