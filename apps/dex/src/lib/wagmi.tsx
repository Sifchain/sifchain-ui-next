import type { PropsWithChildren } from "react";
import { createClient, WagmiConfig } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector(),
    new CoinbaseWalletConnector({
      options: {
        appName: "sifchain DEX",
      },
    }),
    new WalletConnectConnector({
      options: {
        qrcode: true,
      },
    }),
  ],
});

export const WagmiProvider = (props: PropsWithChildren<unknown>) => {
  return <WagmiConfig client={client}>{props.children}</WagmiConfig>;
};
