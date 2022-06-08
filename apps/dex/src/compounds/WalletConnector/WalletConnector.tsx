import {
  ChainEntry,
  CoinbaseIcon,
  ConnectWallets,
  CosmostationIcon,
  KeplrIcon,
  MetamaskIcon,
  WalletconnectCircleIcon,
  WalletEntry,
} from "@sifchain/ui";
import clsx from "clsx";
import React, { FC, useMemo } from "react";
import { useDexEnvironment } from "~/domains/core/envs";

const WalletConnector: FC = () => {
  const { data } = useDexEnvironment();

  const chains = useMemo<ChainEntry[]>(() => {
    if (!data?.chainConfigsByNetwork) {
      return [];
    }

    return Object.entries(data.chainConfigsByNetwork).map(
      ([id, config]): ChainEntry => ({
        id,
        name: config.displayName,
        icon: (
          <figure
            className={clsx(
              "h-6 w-6 bg-cover rounded-full bg-white -translate-x-1",
              {
                "invert border-black bg-black": ["ixo"].includes(id),
              },
            )}
            style={{ backgroundImage: `url('/chains/${id}.png')` }}
          />
        ),
        wallets: ["keplr", "cosmostation", "walletconnect"],
      }),
    );
  }, [data?.chainConfigsByNetwork]);

  const wallets: WalletEntry[] = [
    {
      id: "metamask",
      name: "Metamask",
      icon: <MetamaskIcon />,
    },
    {
      id: "coinbase",
      name: "Coinbase",
      icon: <CoinbaseIcon />,
    },
    {
      id: "walletconnect",
      name: "Walletconnect",
      icon: <WalletconnectCircleIcon />,
    },
    {
      id: "keplr",
      name: "Keplr",
      icon: <KeplrIcon />,
    },
    {
      id: "cosmostation",
      name: "Cosmostation",
      icon: <CosmostationIcon />,
    },
  ];

  return <ConnectWallets chains={chains} wallets={wallets} />;
};

export default WalletConnector;
