import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { AsyncImage } from ".";

export default {
  title: "components/AsyncImage",
  component: AsyncImage,
} as ComponentMeta<typeof AsyncImage>;

const Template: ComponentStory<typeof AsyncImage> = (args) => {
  return <AsyncImage {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
