import {
  BaseCosmConnector,
  useConnect as useCosmConnect,
} from "@sifchain/cosmos-connect";
import {
  Button,
  ChainEntry,
  CoinbaseIcon,
  CosmostationIcon,
  KeplrIcon,
  MetamaskIcon,
  WallectSelector,
  WalletconnectCircleIcon,
  WalletEntry,
} from "@sifchain/ui";
import clsx from "clsx";
import { assoc, indexBy, prop } from "rambda";
import React, { FC, useCallback, useMemo } from "react";
import {
  useConnect as useEtherConnect,
  useDisconnect as useEtherDisconnect,
} from "wagmi";
import { useDexEnvironment } from "~/domains/core/envs";

const WALLET_ICONS = {
  keplr: <KeplrIcon />,
  keplrWalletconnect: <WalletconnectCircleIcon />,
  metaMask: <MetamaskIcon />,
  walletConnect: <WalletconnectCircleIcon />,
  coinbaseWallet: <CoinbaseIcon />,
  cosmostation: <CosmostationIcon />,
};

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
        type: config.chainType,
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
        wallets: ["keplr", "cosmostation", "walletconnect", ""],
      }),
    );
  }, [data?.chainConfigsByNetwork]);

  const { connectors: cosmosConnectors, connect: connectCosmos } =
    useCosmConnect();
  const { connectors: evmConnectors, connect: connectEvm } = useEtherConnect();

  const [wallets, connectorsById] = useMemo(() => {
    const connectors = [
      ...cosmosConnectors.map(assoc("type", "cosmos")),
      ...evmConnectors.map(assoc("type", "evm")),
    ];

    console.log({ connectors });

    const wallets: WalletEntry[] = connectors.map((x) => ({
      id: x.id,
      name: x.name,
      type: x.type as "evm" | "cosmos",
      icon: WALLET_ICONS[x.id as keyof typeof WALLET_ICONS] ?? (
        <WalletconnectCircleIcon />
      ),
    }));

    const connectorsById = indexBy(prop("id"), connectors);

    return [wallets, connectorsById];
  }, [cosmosConnectors, evmConnectors]);

  const handleConnectionRequest = useCallback(
    async ({ walletId = "" }) => {
      const selected = connectorsById[walletId];

      if (!selected) {
        return;
      }

      try {
        switch (selected.type) {
          case "cosmos":
            {
              const connector = cosmosConnectors.find((x) => x.id === walletId);
              if (connector) {
                await connectCosmos(connector as BaseCosmConnector);
              }
            }
            break;
          case "evm":
            {
              const connector = evmConnectors.find((x) => x.id === walletId);
              connectEvm(connector as any);
            }
            break;
        }
      } catch (error) {
        console.log("failed to connect", error);
      }
    },
    [connectEvm, connectEvm, connectorsById, evmConnectors, cosmosConnectors],
  );

  return (
    <WallectSelector
      chains={chains}
      wallets={wallets}
      onConnect={handleConnectionRequest}
    />
  );
};

export default WalletConnector;
