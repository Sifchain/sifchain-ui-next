import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { ComposeProviders } from ".";

export default {
  title: "components/ComposeProviders",
  component: ComposeProviders,
} as ComponentMeta<typeof ComposeProviders>;

const Template: ComponentStory<typeof ComposeProviders> = (args) => {
  return <ComposeProviders {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
