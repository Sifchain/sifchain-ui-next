import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Identicon } from ".";

export default {
  title: "components/Identicon",
  component: Identicon,
} as ComponentMeta<typeof Identicon>;

const Template: ComponentStory<typeof Identicon> = (args) => {
  return <Identicon {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
