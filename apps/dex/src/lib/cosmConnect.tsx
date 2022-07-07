import { CHAINCONFIG_BY_NETWORK_ENV, IBCChainConfig } from "@sifchain/common";
import {
  CosmConnectProvider as BaseCosmConnectProvider,
  InjectedKeplrConnector,
  KeplrWalletConnectConnector,
} from "@sifchain/cosmos-connect";
import { PropsWithChildren, useMemo } from "react";

import { useDexEnvKind } from "~/domains/core/envs";

function useKeplrConnectors() {
  const networkEnv = useDexEnvKind();

  return useMemo(() => {
    const chainInfos = Object.entries(CHAINCONFIG_BY_NETWORK_ENV[networkEnv])
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
  }, [networkEnv]);
}

export const CosmConnectProvider = (props: PropsWithChildren<unknown>) => {
  const keplrConnectors = useKeplrConnectors();

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
