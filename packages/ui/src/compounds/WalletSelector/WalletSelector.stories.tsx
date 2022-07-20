import type { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  AsyncImage,
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
  return (
    <WalletSelector
      {...args}
      onConnect={() => {
        console.log("connecting");
      }}
    />
  );
};

export const Default = Template.bind({});

Default.args = {
  chains: [
    {
      id: "sifchain",
      chainId: "",
      name: "Sifchain",
      icon: <AsyncImage src="/chains/sifchain.png" />,
      type: "ibc",
    },
    {
      id: "ethereum",
      chainId: 1,
      name: "Ethereum",
      icon: <AsyncImage src="/chains/ethereum.png" />,
      type: "eth",
    },
    {
      id: "akash",
      chainId: "",
      name: "Akash",
      icon: <AsyncImage src="/chains/akash.png" />,
      type: "ibc",
    },
    {
      id: "cerberus",
      chainId: "",
      name: "Cerberus",
      icon: <AsyncImage src="/chains/cerberus.png" />,
      type: "ibc",
    },
    {
      id: "comdex",
      chainId: "",
      name: "comdex",
      icon: <AsyncImage src="/chains/comdex.png" />,
      type: "ibc",
    },
    {
      id: "bitsong",
      chainId: "",
      name: "Bitsong",
      icon: <AsyncImage src="/chains/bitsong.png" />,
      type: "ibc",
    },
    {
      id: "crypto-org",
      chainId: "",
      name: "Crypto.org",
      icon: <AsyncImage src="/chains/crypto-org.png" />,
      type: "ibc",
    },
    {
      id: "cosmos",
      chainId: "",
      name: "Cosmos",
      icon: <AsyncImage src="/chains/cosmos.png" />,
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

export const Connected = Template.bind({});

Connected.args = {
  ...Default.args,
  accounts: {
    sifchain: ["sifs15hazsfjrl0k6lhv00anz45zwzp06un2qz2s4mp"],
  },
};
