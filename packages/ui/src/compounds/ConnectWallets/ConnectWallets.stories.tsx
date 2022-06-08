import type { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  CoinbaseIcon,
  CosmostationIcon,
  KeplrIcon,
  MetamaskIcon,
  WalletconnectCircleIcon,
} from "~/components";

import { ConnectWallets } from ".";

export default {
  title: "compounds/ConnectWallet",
  component: ConnectWallets,
} as ComponentMeta<typeof ConnectWallets>;

const Template: ComponentStory<typeof ConnectWallets> = (args) => {
  return <ConnectWallets {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  chains: [
    {
      id: "sifchain",
      name: "Sifchain",
      icon: <img src="/chains/sifchain.png" />,
      wallets: ["keplr", "cosmostation"],
    },
    {
      id: "ethereum",
      name: "Ethereum",
      icon: <img src="/chains/ethereum.png" />,
      wallets: ["metamask", "coinbase", "walletconnect"],
    },
    {
      id: "akash",
      name: "Akash",
      icon: <img src="/chains/akash.png" />,
      wallets: ["keplr", "cosmostation"],
    },
    {
      id: "cerberus",
      name: "Cerberus",
      icon: <img src="/chains/cerberus.png" />,
      wallets: ["keplr", "cosmostation"],
    },
    {
      id: "comdex",
      name: "comdex",
      icon: <img src="/chains/comdex.png" />,
      wallets: ["keplr", "cosmostation"],
    },
    {
      id: "bitsong",
      name: "Bitsong",
      icon: <img src="/chains/bitsong.png" />,
      wallets: ["keplr", "cosmostation"],
    },
    {
      id: "crypto-org",
      name: "Crypto.org",
      icon: <img src="/chains/crypto-org.png" />,
      wallets: ["keplr", "cosmostation"],
    },
    {
      id: "cosmos",
      name: "Cosmos",
      icon: <img src="/chains/cosmos.png" />,
      wallets: ["keplr", "cosmostation"],
    },
  ],
  wallets: [
    {
      id: "metamask",
      name: "Metamask",
      icon: <MetamaskIcon />,
    },
    {
      id: "coinbase",
      name: "Coinbase",
      icon: <CoinbaseIcon />,
    },
    {
      id: "walletconnect",
      name: "Walletconnect",
      icon: <WalletconnectCircleIcon />,
    },
    {
      id: "keplr",
      name: "Keplr",
      icon: <KeplrIcon />,
    },
    {
      id: "cosmostation",
      name: "Cosmostation",
      icon: <CosmostationIcon />,
    },
  ],
};
