import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";
import type { BaseCosmConnector } from "../core";
import { noopStorage, StorageOptions } from "./storage";
import { useStorageState } from "./utils/hooks";

export type CosmConnectContextValue = {
  connectors: BaseCosmConnector[];
  activeConnector?: BaseCosmConnector;
  connect: (connector: BaseCosmConnector) => Promise<void>;
  disconnect: (connector: BaseCosmConnector) => Promise<void>;
};

export type CosmConnectProviderProps = {
  connectors: BaseCosmConnector[];
  autoConnect?: boolean;
  persistOptions?: StorageOptions;
};

export const CosmConnectContext = React.createContext<CosmConnectContextValue>({
  connectors: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  connect: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect: async () => {},
});

export const CosmConnectProvider = (props: PropsWithChildren<CosmConnectProviderProps>) => {
  const [activeConnectorId, setActiveConnectorId] = useStorageState<string | undefined>(
    (props.persistOptions?.prefix ?? "@@cosmConnect") + "ActiveConnection",
    undefined,
    props.autoConnect ? props.persistOptions?.storage ?? window.localStorage : noopStorage,
  );
  const activeConnector = props.connectors.find((x) => x.id === activeConnectorId);

  const [initSuccessful, setIsInitSuccessful] = useState(() => activeConnector?.connected ?? false);

  useEffect(() => {
    const connectorAndListenerPairs = props.connectors.map(
      (x) => [x, () => setActiveConnectorId((y) => (y === x.id ? undefined : y))] as const,
    );

    connectorAndListenerPairs.forEach(([connector, listener]) => connector.addListener("disconnect", listener));

    return () =>
      connectorAndListenerPairs.forEach(([connector, listener]) => connector.removeListener("disconnect", listener));
  }, [props.connectors, setActiveConnectorId]);

  // get active connector from storage on first mount then try to connect it
  useEffect(() => {
    if (!activeConnector?.connected) {
      void activeConnector?.connect().then(() => {
        setIsInitSuccessful(true);
      });
    }
  }, [activeConnector]);

  return (
    <CosmConnectContext.Provider
      value={{
        connectors: props.connectors,
        activeConnector: initSuccessful ? activeConnector : undefined,
        connect: useCallback(
          async (connector: BaseCosmConnector) => {
            await connector.connect();
            setActiveConnectorId(connector.id);
            setIsInitSuccessful(true);
          },
          [setActiveConnectorId],
        ),
        disconnect: useCallback(
          async (connector: BaseCosmConnector) => {
            await connector.disconnect();
            setActiveConnectorId((x) => (x === connector.id ? undefined : x));
          },
          [setActiveConnectorId],
        ),
      }}
    >
      {props.children}
    </CosmConnectContext.Provider>
  );
};
