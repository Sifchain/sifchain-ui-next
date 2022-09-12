import { CHAINCONFIG_BY_NETWORK_ENV, IBCChainConfig } from "@sifchain/common";
import {
  CosmConnectProvider as BaseCosmConnectProvider,
  InjectedKeplrConnector,
  KeplrWalletConnectConnector,
  MnemonicConnector,
} from "@sifchain/cosmos-connect";
import { isDefined } from "@sifchain/utils";
import { PropsWithChildren, useMemo } from "react";

import { useDexEnvKind } from "~/domains/core/envs";

function useKeplrConnectors() {
  const networkEnv = useDexEnvKind();

  return useMemo(() => {
    const chainInfos = Object.entries(CHAINCONFIG_BY_NETWORK_ENV[networkEnv])
      .filter(([, chain]) => "keplrChainInfo" in chain)
      .map(([, chain]) => (chain as IBCChainConfig).keplrChainInfo);

    return [
      process.env.NODE_ENV === "production" ? undefined : new MnemonicConnector({ chainInfos }),
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
          icons: ["https://assets.coingecko.com/coins/images/14044/small/EROWAN.png?1614656300"],
        },
      }),
    ].filter(isDefined);
  }, [networkEnv]);
}

export const CosmConnectProvider = (props: PropsWithChildren<unknown>) => {
  const keplrConnectors = useKeplrConnectors();

  return (
    <BaseCosmConnectProvider connectors={keplrConnectors} autoConnect>
      {props.children}
    </BaseCosmConnectProvider>
  );
};
