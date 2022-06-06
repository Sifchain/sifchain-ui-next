import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { ConnectWallet } from ".";

export default {
  title: "compounds/ConnectWallet",
  component: ConnectWallet,
} as ComponentMeta<typeof ConnectWallet>;

const Template: ComponentStory<typeof ConnectWallet> = (args) => {
  return <ConnectWallet {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
