import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";
import {
  CoinbaseIcon,
  CosmostationIcon,
  KeplrIcon,
  MetamaskIcon,
  WalletconnectCircleIcon,
} from "~/components";

import { WalletSelector } from ".";

export default {
  title: "compounds/WalletSelector",
  component: WalletSelector,
} as ComponentMeta<typeof WalletSelector>;

const Template: ComponentStory<typeof WalletSelector> = (args) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <WalletSelector
      {...args}
      onConnect={() => {
        console.log("connecting");

        setIsLoading(true);

        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }}
      isLoading={isLoading}
    />
  );
};

export const Default = Template.bind({});

Default.args = {
  chains: [
    {
      id: "sifchain",
      name: "Sifchain",
      icon: <img src="/chains/sifchain.png" />,
      wallets: ["keplr", "cosmostation"],
      type: "ibc",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      icon: <img src="/chains/ethereum.png" />,
      wallets: ["metamask", "coinbase", "walletconnect"],
      type: "eth",
    },
    {
      id: "akash",
      name: "Akash",
      icon: <img src="/chains/akash.png" />,
      wallets: ["keplr", "cosmostation"],
      type: "ibc",
    },
    {
      id: "cerberus",
      name: "Cerberus",
      icon: <img src="/chains/cerberus.png" />,
      wallets: ["keplr", "cosmostation"],
      type: "ibc",
    },
    {
      id: "comdex",
      name: "comdex",
      icon: <img src="/chains/comdex.png" />,
      wallets: ["keplr", "cosmostation"],
      type: "ibc",
    },
    {
      id: "bitsong",
      name: "Bitsong",
      icon: <img src="/chains/bitsong.png" />,
      wallets: ["keplr", "cosmostation"],
      type: "ibc",
    },
    {
      id: "crypto-org",
      name: "Crypto.org",
      icon: <img src="/chains/crypto-org.png" />,
      wallets: ["keplr", "cosmostation"],
      type: "ibc",
    },
    {
      id: "cosmos",
      name: "Cosmos",
      icon: <img src="/chains/cosmos.png" />,
      wallets: ["keplr", "cosmostation"],
      type: "ibc",
    },
  ],
  wallets: [
    {
      id: "metamask",
      name: "Metamask",
      icon: <MetamaskIcon />,
      type: "eth",
    },
    {
      id: "coinbase",
      name: "Coinbase",
      icon: <CoinbaseIcon />,
      type: "eth",
    },
    {
      id: "walletconnect",
      name: "Walletconnect",
      icon: <WalletconnectCircleIcon />,
      type: "ibc",
    },
    {
      id: "keplr",
      name: "Keplr",
      icon: <KeplrIcon />,
      type: "ibc",
    },
    {
      id: "cosmostation",
      name: "Cosmostation",
      icon: <CosmostationIcon />,
      type: "ibc",
    },
  ],
};
