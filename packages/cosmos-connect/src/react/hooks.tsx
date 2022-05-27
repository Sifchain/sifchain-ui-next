import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
} from "react";
import type { BaseCosmConnector } from "../core";
import { noopStorage, StorageOptions } from "./storage";
import { useAsyncFunc, useStorageState } from "./utils";

export type CosmConnectContextValue = {
  connectors: BaseCosmConnector[];
  activeConnector?: BaseCosmConnector;
  setActiveConnector: React.Dispatch<
    React.SetStateAction<BaseCosmConnector<any> | undefined>
  >;
  connect: (connector: BaseCosmConnector) => Promise<void>;
  disconnect: (connector: BaseCosmConnector) => Promise<void>;
};

export type CosmConnectProviderProps = {
  connectors: BaseCosmConnector[];
  autoConnect?: boolean;
  persistOptions?: StorageOptions;
};

const CosmConnectContext = React.createContext<CosmConnectContextValue>({
  connectors: [],
  setActiveConnector: () => {},
  connect: async () => {},
  disconnect: async () => {},
});

export const CosmConnectProvider = (
  props: PropsWithChildren<CosmConnectProviderProps>,
) => {
  const [activeConnector, setActiveConnector] = useStorageState<
    BaseCosmConnector | undefined
  >(
    (props.persistOptions?.prefix ?? "@@cosmConnect") + "ActiveConnection",
    undefined,
    props.autoConnect
      ? props.persistOptions?.storage ?? window.localStorage
      : noopStorage,
  );

  useEffect(() => {
    props.connectors.forEach((x) => {
      x.addListener("disconnect", () =>
        setActiveConnector((y) => (y?.id === x.id ? undefined : y)),
      );
    });

    return () => props.connectors.forEach((x) => x.removeAllListeners());
  }, [props.connectors]);

  return (
    <CosmConnectContext.Provider
      value={{
        connectors: props.connectors,
        activeConnector,
        setActiveConnector,
        connect: useCallback(async (connector: BaseCosmConnector) => {
          await connector.connect();
          setActiveConnector(connector);
        }, []),
        disconnect: useCallback(
          async (connector: BaseCosmConnector) => {
            await connector.disconnect();
            setActiveConnector((x) => (x?.id === connector.id ? undefined : x));
          },
          [activeConnector],
        ),
      }}
    >
      {props.children}
    </CosmConnectContext.Provider>
  );
};

export const useConnect = () => {
  const { connectors, activeConnector, connect, disconnect } =
    useContext(CosmConnectContext);

  const connectAsyncFunc = useAsyncFunc(connect);
  const disconnectAsyncFunc = useAsyncFunc(disconnect);

  return {
    connectors,
    activeConnector,
    connect: connectAsyncFunc.fetch,
    connectingStatus: connectAsyncFunc.status,
    disconnect: disconnectAsyncFunc.fetch,
    disconnectingStatus: disconnectAsyncFunc.status,
  };
};

export const useSigningStargateClient = (chainId: string) => {
  const { activeConnector } = useConnect();

  const {
    data: client,
    fetch,
    status,
  } = useAsyncFunc(
    async () => activeConnector?.getSigningStargateClient(chainId),
    [activeConnector, chainId],
  );

  useEffect(() => {
    fetch();
  }, [activeConnector]);

  return { client, status };
};
