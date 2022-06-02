import {
  InjectedKeplrConnector,
  KeplrWalletConnectConnector,
} from "@sifchain/cosmos-connect";
import { CosmConnectProvider as BaseCosmConnectProvider } from "@sifchain/cosmos-connect";
import type { PropsWithChildren } from "react";

const connectors = [
  new InjectedKeplrConnector({ chainInfos: [] }),
  new KeplrWalletConnectConnector({ chainInfos: [] }),
];

export const CosmConnectProvider = (props: PropsWithChildren<{}>) => (
  <BaseCosmConnectProvider
    connectors={connectors}
    persistOptions={{
      // can't provide window.localStorage directly because of next.js pre-rendering
      storage: {
        getItem: (key) => window.localStorage.getItem(key),
        setItem: (key, value) => window.localStorage.setItem(key, value),
        removeItem: (key) => window.localStorage.removeItem(key),
      },
    }}
    autoConnect
  >
    {props.children}
  </BaseCosmConnectProvider>
);
