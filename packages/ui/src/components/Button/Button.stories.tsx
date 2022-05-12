import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button } from "./";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "components/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
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
