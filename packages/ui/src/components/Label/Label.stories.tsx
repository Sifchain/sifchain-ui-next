import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Label } from "./";

export default {
  title: "components/Label",
  component: Label,
} as ComponentMeta<typeof Label>;

const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  variant: "primary",
  children: "Connect Wallets",
};

export const Secondary = Template.bind({});

Secondary.args = {
  children: "Connect Wallets",
  variant: "secondary",
};

export const Disabled = Template.bind({});

Disabled.args = {
  children: "Connect Wallets",
  disabled: true,
};

export const Large = Template.bind({});

Large.args = {
  size: "lg",
  children: "Connect Wallets",
};

export const Small = Template.bind({});

Small.args = {
  size: "sm",
  children: "Connect Wallets",
};
