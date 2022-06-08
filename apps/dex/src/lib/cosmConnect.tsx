import { CHAINCONFIG_BY_NETWORK_ENV, IBCChainConfig } from "@sifchain/common";
import {
  CosmConnectProvider as BaseCosmConnectProvider,
  InjectedKeplrConnector,
  KeplrWalletConnectConnector,
} from "@sifchain/cosmos-connect";
import type { PropsWithChildren } from "react";

export const KEPLR_CHAIN_INFOS = Object.entries(
  CHAINCONFIG_BY_NETWORK_ENV,
).flatMap(([_, chainMap]) =>
  Object.values(chainMap)
    .filter((chain) => "keplrChainInfo" in chain)
    .map((chain) => chain as IBCChainConfig)
    .map((chain) => chain.keplrChainInfo),
);

export const CONNECTORS = [
  new InjectedKeplrConnector({ chainInfos: KEPLR_CHAIN_INFOS }),
  new KeplrWalletConnectConnector({
    chainInfos: KEPLR_CHAIN_INFOS,
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

export const CosmConnectProvider = (props: PropsWithChildren<unknown>) => (
  <BaseCosmConnectProvider
    connectors={CONNECTORS}
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
