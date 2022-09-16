import type { ChainConfig } from "@sifchain/common";
import { useConnect as useCosmConnect } from "@sifchain/cosmos-connect";
import {
  ChainEntry,
  CoinbaseIcon,
  CosmosIcon,
  CosmostationIcon,
  IbcChainEntry,
  KeplrIcon,
  MetamaskIcon,
  WalletconnectCircleIcon,
  WalletSelector,
} from "@sifchain/ui";
import clsx from "clsx";
import { assoc, indexBy, omit, prop } from "rambda";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useConnect as useEtherConnect, useDisconnect as useEtherDisconnect } from "wagmi";

import { useDexEnvironment } from "~/domains/core/envs";

import { useEnabledChainsStore } from "./store";

const WALLET_ICONS = {
  directSecp256k1HdWallet: <CosmosIcon />,
  keplr: <KeplrIcon />,
  keplrWalletConnect: <WalletconnectCircleIcon />,
  metaMask: <MetamaskIcon />,
  walletConnect: <WalletconnectCircleIcon />,
  coinbaseWallet: <CoinbaseIcon />,
  cosmostation: <CosmostationIcon />,
};

type WalletKind = keyof typeof WALLET_ICONS;

const WALLET_LABELS: Record<WalletKind, string> = {
  directSecp256k1HdWallet: "Mnemonic (INSECURE FOR TESTING PURPOSE ONLY)",
  keplr: "Keplr",
  keplrWalletConnect: "WalletConnect (Keplr)",
  metaMask: "MetaMask",
  walletConnect: "WalletConnect",
  coinbaseWallet: "Coinbase",
  cosmostation: "Cosmostation",
};

const WalletConnector: FC = () => {
  const { data } = useDexEnvironment();

  const { state: enabledChainsState, actions } = useEnabledChainsStore();

  const chains = useMemo<ChainEntry[]>(() => {
    if (!data?.chainConfigsByNetwork) {
      return [];
    }

    const walletConnectorSupportedChains = [data.chainConfigsByNetwork.sifchain, data.chainConfigsByNetwork.ethereum];

    return walletConnectorSupportedChains.map(
      (chain): ChainEntry => ({
        id: chain.chainId.toString(),
        type: chain.chainType,
        chainId: chain.chainId as any,
        name: chain.displayName,
        nativeAssetSymbol: chain.nativeAssetSymbol,
        connected: false,
        icon: (
          <div
            className={clsx("h-6 w-6 rounded-full bg-white bg-cover", {
              "border-black bg-black invert": ["ixo"].includes(chain.chainId.toString()),
            })}
            style={{ backgroundImage: `url('/chains/${chain.network}.png')` }}
          />
        ),
      }),
    );
  }, [data?.chainConfigsByNetwork]);

  const {
    connectors: cosmosConnectors,
    connect: connectCosmos,
    disconnect: disconnectCosmos,
    isConnected: isCosmosConnected,
    activeConnector: cosmosActiveConnector,
    updatedAt,
  } = useCosmConnect();

  const {
    connectors: evmConnectors,
    connectAsync: connectEvm,
    isSuccess: isEthConnected,
    data: evmData,
  } = useEtherConnect();

  const { disconnect: disconnectEVM } = useEtherDisconnect();

  const [accounts, setAccounts] = useState<Record<string, string[]>>({});

  useEffect(
    () =>
      void (async () => {
        const enabledChains = chains.filter((x) => enabledChainsState.networks.includes(x.id));

        if (cosmosActiveConnector) {
          const entries = await Promise.all(
            enabledChains
              .filter((chain): chain is IbcChainEntry => chain.type === "ibc")
              .flatMap(async (chain) => {
                try {
                  const signer = await cosmosActiveConnector.getSigner(chain.chainId);
                  const accounts = await signer.getAccounts();

                  return [chain.chainId, accounts.map((x) => x.address)] as const;
                } catch (error) {
                  if (error instanceof Error && error.message.includes("Unknown chain info")) {
                    //

                    console.log("failed to read chain", chain.chainId);
                  }
                  console.log({ failed: (error as Error)?.message });
                  return [chain.chainId, []] as const;
                }
              }),
          );

          const cosmosAccounts = Object.fromEntries(entries.filter(([, xs]) => xs.length));

          setAccounts((accounts) => ({
            ...accounts,
            ...cosmosAccounts,
          }));
        }

        const ethActiveConnector = evmConnectors.find((x) => x.ready);

        if (ethActiveConnector) {
          const entries = await Promise.all(
            enabledChains
              .filter((chain) => chain.type === "eth")
              .flatMap(async (chain) => {
                try {
                  const signer = await ethActiveConnector.getSigner();
                  const account = await signer.getAddress();

                  return [chain.id, [account]] as const;
                } catch (error) {
                  return [chain.id, []] as const;
                }
              }),
          );

          const ethAccounts = Object.fromEntries(entries.filter(([, xs]) => xs.length));

          setAccounts((accounts) => ({
            ...accounts,
            ...ethAccounts,
          }));
        }
      })(),
    [chains, cosmosActiveConnector, enabledChainsState.networks, evmConnectors, updatedAt],
  );

  useEffect(() => {
    const listener = (chainIds: string | string[]) => {
      if (typeof chainIds === "string") {
        actions.enableNetwork(chainIds);
      } else {
        chainIds.forEach(actions.enableNetwork);
      }
    };

    cosmosActiveConnector?.addListener("enable", listener);

    return () => void cosmosActiveConnector?.removeListener("enable", listener);
  }, [actions, cosmosActiveConnector]);

  const [wallets, connectorsById] = useMemo(() => {
    const connectors = [
      ...cosmosConnectors.map(assoc("type", "ibc" as ChainConfig["chainType"])),
      ...evmConnectors.map(assoc("type", "eth" as ChainConfig["chainType"])),
    ];

    const wallets = connectors.map((x) => ({
      id: x.id,
      type: x.type,
      name: WALLET_LABELS[x.id as WalletKind],
      icon: WALLET_ICONS[x.id as WalletKind],
      isConnected: x.type === "ibc" ? isCosmosConnected : isEthConnected,
      account: x.type === "ibc" ? "" : evmData?.account ?? "",
    }));

    const connectorsById = indexBy(prop("id"), connectors);

    return [wallets, connectorsById];
  }, [cosmosConnectors, evmConnectors, isCosmosConnected, isEthConnected, evmData]);

  const handleConnectionRequest = useCallback(
    async ({ walletId = "", chainId = "" }) => {
      const selected = connectorsById[walletId];

      if (!selected) {
        console.error(`Unknown wallet ${walletId}`);
        return;
      }

      try {
        switch (selected.type) {
          case "ibc":
            {
              const connector = cosmosConnectors.find((x) => x.id === walletId);

              if (!connector) {
                console.error(`No connector found for wallet: ${walletId}`);
                return;
              }

              try {
                await connectCosmos(connector);
              } catch (error) {
                console.log(`Error connecting to ${chainId} via ${walletId}`, error);
              }
            }
            break;
          case "eth":
            {
              const connector = evmConnectors.find((x) => x.id === walletId);

              if (!connector) {
                console.error(`No connector found for wallet: ${walletId}`);
                return;
              }

              const isAuthorized = await connector.isAuthorized();

              if (isAuthorized) {
                const account = await connector.getAccount();
                setAccounts(assoc(chainId, [account]));
              } else {
                const { account } = await connectEvm({ connector });
                setAccounts(assoc(chainId, [account]));
              }
            }
            break;
        }

        actions.enableNetwork(chainId);
      } catch (error) {
        console.log("failed to connect", error);
      }
    },
    [connectorsById, actions, cosmosConnectors, connectCosmos, evmConnectors, connectEvm],
  );

  const handleDisconnectionRequest = useCallback(
    async ({ chainId }: { chainId: string | number }) => {
      const selected = chains.find((x) => x.chainId.toString() === chainId.toString());

      if (!selected) {
        console.error(`Unknown chain ${chainId}`);
        return;
      }

      switch (selected.type) {
        case "ibc":
          if (cosmosActiveConnector !== undefined) {
            disconnectCosmos(cosmosActiveConnector);
          }
          break;
        case "eth": {
          disconnectEVM();
        }
      }

      setAccounts(omit([chainId.toString()]));
      actions.disableChain(selected.id);
    },
    [actions, chains, cosmosActiveConnector, disconnectCosmos, disconnectEVM],
  );

  return (
    <WalletSelector
      chains={chains.map((chain) => ({
        ...chain,
        connected: Boolean(accounts[chain.id]?.length ?? 0),
      }))}
      wallets={wallets}
      accounts={accounts}
      onDisconnect={handleDisconnectionRequest}
      onConnect={handleConnectionRequest}
    />
  );
};

export default WalletConnector;
