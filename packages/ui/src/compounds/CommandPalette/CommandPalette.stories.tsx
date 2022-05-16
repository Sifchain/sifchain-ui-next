import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CommandPalette } from "./";

export default {
  title: "components/CommandPalette",
  component: CommandPalette,
} as ComponentMeta<typeof CommandPalette>;

const Template: ComponentStory<typeof CommandPalette> = (args) => (
  <>
    <CommandPalette {...args} />
  </>
);

export const Default = Template.bind({});

Default.args = {};
