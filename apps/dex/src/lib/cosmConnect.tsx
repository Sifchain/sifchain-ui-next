import { chainConfigByNetworkEnv, IBCChainConfig } from "@sifchain/common";
import {
  CosmConnectProvider as BaseCosmConnectProvider,
  InjectedKeplrConnector,
  KeplrWalletConnectConnector,
} from "@sifchain/cosmos-connect";
import type { PropsWithChildren } from "react";

const chainInfos = Object.entries(chainConfigByNetworkEnv).flatMap((x) =>
  Object.values(x[1])
    .filter((y) => "keplrChainInfo" in y)
    .map((y) => y as IBCChainConfig)
    .map((y) => y.keplrChainInfo),
);

const connectors = [
  new InjectedKeplrConnector({ chainInfos }),
  new KeplrWalletConnectConnector({
    chainInfos,
    clientMeta: {
      name: "Sifchain",
      description: "The omni chain",
      url: "https://sifchain.network",
      icons: [
        "https://assets.coingecko.com/coins/images/14044/small/EROWAN.png?1614656300",
      ],
    },
  }),
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
