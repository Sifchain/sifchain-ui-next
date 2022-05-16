import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "./";

export default {
  title: "components/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  variant: "primary",
  children: "Click me",
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: "Click me",
};

export const Large = Template.bind({});
Large.args = {
  size: "lg",
  children: "Click me",
};

export const Small = Template.bind({});
Small.args = {
  size: "sm",
  children: "Click me",
};
