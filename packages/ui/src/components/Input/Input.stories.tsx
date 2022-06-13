import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Input, InputButton } from ".";

export default {
  title: "components/Input",
  component: Input,
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => {
  return <Input {...args} />;
};

export const Default = Template.bind({});

Default.args = {};

export const WithButton = Template.bind({});

WithButton.args = {
  className: "pl-24",
  placeholder: "Search",
  children: (
    <div className="absolute flex gap-1.5 pl-1.5">
      <InputButton>Half</InputButton>
      <InputButton>Max</InputButton>
    </div>
  ),
};
