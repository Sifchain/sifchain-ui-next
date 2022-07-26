import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Input } from ".";
import { Label } from "../Label";

export default {
  title: "components/Input",
  component: Input,
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => {
  return (
    <div className="bg-black p-8">
      <Input {...args} />
    </div>
  );
};

export const Default = Template.bind({});

Default.args = {
  placeholder: "Placeholder",
};

export const Disabled = Template.bind({});

Disabled.args = {
  placeholder: "Disabled input",
  disabled: true,
};

export const FullWidth = Template.bind({});

FullWidth.args = {
  fullWidth: true,
  placeholder: "Full width input",
};

export const WithLabels = Template.bind({});

WithLabels.args = {
  inputClassName: "text-right",
  placeholder: "20,000",
  label: "Amount",
  secondaryLabel: "ETH",
};

export const WithButton = Template.bind({});

WithButton.args = {
  inputClassName: "text-right",
  placeholder: "20,000",
  label: "Amount",
  secondaryLabel: "ETH",
  leadingIcon: (
    <div className="flex gap-1.5">
      <Label>Half</Label>
      <Label>Max</Label>
    </div>
  ),
};
