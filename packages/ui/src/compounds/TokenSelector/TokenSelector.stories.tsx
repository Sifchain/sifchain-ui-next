import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { TokenSelector } from ".";

export default {
  title: "compounds/TokenSelector",
  component: TokenSelector,
} as ComponentMeta<typeof TokenSelector>;

const Template: ComponentStory<typeof TokenSelector> = (args) => {
  return <TokenSelector {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  label: "Token",
  modalTitle: "From",
};
