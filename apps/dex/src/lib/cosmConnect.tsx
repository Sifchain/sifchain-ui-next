import type { IBCChainConfig } from "@sifchain/common";
import {
  CosmConnectProvider as BaseCosmConnectProvider,
  InjectedKeplrConnector,
  KeplrWalletConnectConnector,
} from "@sifchain/cosmos-connect";
import type { PropsWithChildren } from "react";
import { useQuery } from "react-query";
import { useDexEnvironment } from "~/domains/core/envs";

function useKeplrConnectors() {
  const { data: dexEnv, isSuccess: isDexEnvReady } = useDexEnvironment();

  return useQuery(
    "keplr-connectors",
    () => {
      if (!dexEnv) {
        return [];
      }

      const chainInfos = Object.entries(dexEnv.chainConfigsByNetwork)
        .filter(([, chain]) => "keplrChainInfo" in chain)
        .map(([, chain]) => (chain as IBCChainConfig).keplrChainInfo);

      return [
        new InjectedKeplrConnector({
          chainInfos,
        }),
        new KeplrWalletConnectConnector({
          chainInfos,
          modalUiOptions: {
            backdrop: {
              style: { zIndex: 11 },
            },
          },
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
    },
    {
      enabled: isDexEnvReady,
    },
  );
}

export const CosmConnectProvider = (props: PropsWithChildren<unknown>) => {
  const { data: keplrConnectors = [] } = useKeplrConnectors();

  return (
    <BaseCosmConnectProvider
      connectors={keplrConnectors}
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
};
