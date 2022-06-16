import type { ChainConfig } from "@sifchain/common";
import { useConnect as useCosmConnect } from "@sifchain/cosmos-connect";
import {
  ChainEntry,
  CoinbaseIcon,
  CosmostationIcon,
  KeplrIcon,
  MetamaskIcon,
  WalletSelector,
  WalletconnectCircleIcon,
} from "@sifchain/ui";
import clsx from "clsx";
import { assoc, indexBy, prop } from "rambda";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
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
      }),
    );
  }, [data?.chainConfigsByNetwork]);

  const {
    connectors: cosmosConnectors,
    connect: connectCosmos,
    isConnected: isCosmosConnected,
    connectingStatus: cosmosConnectingStatus,
    activeConnector: cosmosActiveConnector,
    disconnect: disconnectCosmos,
  } = useCosmConnect();

  const {
    connectors: evmConnectors,
    connectAsync: connectEvm,
    isConnected: isEthConnected,
    pendingConnector: pendingEvmConnector,
    data: evmData,
  } = useEtherConnect();

  const { disconnect: disconnectEVM } = useEtherDisconnect();

  const [accounts, setAccounts] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (cosmosActiveConnector) {
      Promise.all(
        chains.flatMap(async (chain) => {
          try {
            const signer = await cosmosActiveConnector.getSigner(chain.id);
            const accounts = await signer.getAccounts();

            return [chain.id, accounts.map((x) => x.address)];
          } catch (error) {
            return [chain.id, []];
          }
        }),
      ).then((entries) => {
        const cosmosAccounts = Object.fromEntries(
          entries.filter(([_, xs]) => xs),
        );
        setAccounts((accounts) => ({
          ...accounts,
          ...cosmosAccounts,
        }));
      });
    }
  }, [cosmosActiveConnector]);

  const [wallets, connectorsById] = useMemo(() => {
    const connectors = [
      ...cosmosConnectors.map(assoc("type", "ibc" as ChainConfig["chainType"])),
      ...evmConnectors.map(assoc("type", "eth" as ChainConfig["chainType"])),
    ];

    const wallets = connectors.map((x) => ({
      id: x.id,
      name: x.name,
      type: x.type,
      icon: WALLET_ICONS[x.id as keyof typeof WALLET_ICONS] ?? (
        <WalletconnectCircleIcon />
      ),
      isConnected: x.type === "ibc" ? isCosmosConnected : isEthConnected,
      account: x.type === "ibc" ? "" : evmData?.account ?? "",
    }));

    const connectorsById = indexBy(prop("id"), connectors);

    return [wallets, connectorsById];
  }, [
    cosmosConnectors,
    evmConnectors,
    isCosmosConnected,
    isEthConnected,
    evmData,
  ]);

  const handleConnectionRequest = useCallback(
    async ({ walletId = "", chainId = "" }) => {
      const selected = connectorsById[walletId];

      if (!selected) {
        console.log("selected", selected);
        return;
      }

      try {
        switch (selected.type) {
          case "ibc":
            {
              const connector = cosmosConnectors.find((x) => x.id === walletId);
              if (connector) {
                console.log("connecting to", connector);
                await connectCosmos(connector);
              } else {
                console.log("connector not found: ", chainId);
              }
            }
            break;
          case "eth":
            {
              const connector = evmConnectors.find((x) => x.id === walletId);
              if (connector) {
                console.log("connecting to", connector);
                const account = await connectEvm(connector);
                console.log({ account });
              } else {
                console.log("connector not found");
              }
            }
            break;
        }
      } catch (error) {
        console.log("failed to connect", error);
      }
    },
    [connectEvm, connectEvm, connectorsById, evmConnectors, cosmosConnectors],
  );

  const handleDisconnectionRequest = useCallback(
    async ({ walletId = "", chainId = "" }) => {
      const selected = connectorsById[walletId];
      if (selected) {
        await selected.disconnect();
      }
    },
    [],
  );

  useEffect(() => {
    if (cosmosActiveConnector) {
      console.log("Cosmos active connector:", cosmosActiveConnector);

      cosmosActiveConnector.connect().then(() => console.log("connected"));
    }
  }, [accounts, cosmosActiveConnector, isCosmosConnected]);

  return (
    <WalletSelector
      chains={chains.filter((x) => !accounts[x.id]?.length)}
      wallets={wallets}
      accounts={accounts}
      isLoading={
        Boolean(pendingEvmConnector) || cosmosConnectingStatus === "pending"
      }
      onDisconnect={handleDisconnectionRequest}
      onConnect={handleConnectionRequest}
    />
  );
};

export default WalletConnector;
