import type { ChainConfig, NetworkKind } from "@sifchain/common";
import { useConnect as useCosmConnect } from "@sifchain/cosmos-connect";
import {
  ChainEntry,
  CoinbaseIcon,
  ConnectedAccount,
  CosmostationIcon,
  IbcChainEntry,
  KeplrIcon,
  MetamaskIcon,
  RenderConnectedAccount,
  WalletconnectCircleIcon,
  WalletSelector,
} from "@sifchain/ui";
import clsx from "clsx";
import { assoc, indexBy, omit, prop } from "rambda";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useConnect as useEtherConnect, useDisconnect as useEtherDisconnect } from "wagmi";

import { useDexEnvironment } from "~/domains/core/envs";

import { useCosmosNativeBalance, useEthNativeBalance } from "./hooks";
import { useEnabledChainsStore } from "./store";

const WALLET_ICONS = {
  keplr: <KeplrIcon />,
  keplrWalletConnect: <WalletconnectCircleIcon />,
  metaMask: <MetamaskIcon />,
  walletConnect: <WalletconnectCircleIcon />,
  coinbaseWallet: <CoinbaseIcon />,
  cosmostation: <CosmostationIcon />,
};

type WalletKind = keyof typeof WALLET_ICONS;

const WALLET_LABELS: Record<WalletKind, string> = {
  keplr: "Keplr",
  keplrWalletConnect: "WallectConnect (Keplr)",
  metaMask: "MetaMask",
  walletConnect: "WallectConnect",
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

    return Object.entries(data.chainConfigsByNetwork).map(
      ([id, config]): ChainEntry => ({
        id,
        type: config.chainType,
        chainId: config.chainId as any,
        name: config.displayName,
        nativeAssetSymbol: config.nativeAssetSymbol,
        connected: false,
        icon: (
          <figure
            className={clsx("h-6 w-6 -translate-x-1 rounded-full bg-white bg-cover", {
              "border-black bg-black invert": ["ixo"].includes(id),
            })}
            style={{ backgroundImage: `url('/chains/${id}.png')` }}
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
          console.log({
            cosmosActiveConnector,
            enabledChains: enabledChains,
          });
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
    [chains, cosmosActiveConnector, enabledChainsState.networks, evmConnectors],
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
                setAccounts(assoc("ethereum", [account]));
              } else {
                const account = await connectEvm({ connector });
                setAccounts(assoc("ethereum", [account]));
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
    async ({ chainId = "" }) => {
      const selected = chains.find((x) => x.chainId === chainId);

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

      setAccounts(omit([chainId]));
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
      renderConnectedAccount={ConnectedAccountItem}
    />
  );
};

const ConnectedAccountItem: RenderConnectedAccount = (props) => {
  const RenderComponent = props.chainType === "eth" ? EthConnectedAccountItem : IbcConnectedAccountItem;

  return <RenderComponent {...props} />;
};

const IbcConnectedAccountItem: RenderConnectedAccount = (props) => {
  const { data } = useCosmosNativeBalance({
    chainId: props.chainId,
    networkId: props.networkId as NetworkKind,
    address: props.account,
  });

  return (
    <ConnectedAccount
      {...props}
      nativeAssetDollarValue={data?.dollarValue ?? ""}
      nativeAssetSymbol={data?.denom?.toUpperCase() ?? ""}
      nativeAssetBalance={data?.amount?.toFloatApproximation().toFixed(4) ?? ""}
    />
  );
};

const EthConnectedAccountItem: RenderConnectedAccount = ({ networkId, account, ...props }) => {
  const { data } = useEthNativeBalance({ chainId: networkId }, account);

  return (
    <ConnectedAccount
      {...props}
      account={account}
      networkId={networkId}
      nativeAssetDollarValue={data?.dollarValue ?? ""}
      nativeAssetSymbol={data?.denom?.toUpperCase() ?? ""}
      nativeAssetBalance={data?.amount?.toString() ?? ""}
    />
  );
};

export default WalletConnector;
