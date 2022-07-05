import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { SortIcon } from ".";

export default {
  title: "components/SortIcon",
  component: SortIcon,
} as ComponentMeta<typeof SortIcon>;

const Template: ComponentStory<typeof SortIcon> = (args) => {
  return <SortIcon className="text-gray-300" {...args} />;
};

export const Default = Template.bind({});

Default.args = {};

export const Ascending = Template.bind({});

Ascending.args = {
  active: true,
  sortDirection: "asc",
};

export const Descending = Template.bind({});

Descending.args = {
  active: true,
  sortDirection: "desc",
};
