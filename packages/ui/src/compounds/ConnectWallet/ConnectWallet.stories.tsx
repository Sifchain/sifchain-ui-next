import type { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  CoinbaseIcon,
  CosmostationIcon,
  KeplrIcon,
  MetamaskIcon,
  WalletconnectCircleIcon,
} from "~/components";

import { ConnectWallet } from ".";

export default {
  title: "compounds/ConnectWallet",
  component: ConnectWallet,
} as ComponentMeta<typeof ConnectWallet>;

const Template: ComponentStory<typeof ConnectWallet> = (args) => {
  return <ConnectWallet {...args} />;
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
