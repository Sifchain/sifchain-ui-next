import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { SearchInput } from "./";

export default {
  title: "components/SearchInput",
  component: SearchInput,

  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof SearchInput>;

const Template: ComponentStory<typeof SearchInput> = (args) => <SearchInput {...args} />;

export const Default = Template.bind({});

Default.args = {
  placeholder: "Quick search...",
};

export const WithHotKey = Template.bind({});

WithHotKey.args = {
  placeholder: "Quick search...",
  hotkey: "/",
  containerClassName: "max-w-[220px]",
};
