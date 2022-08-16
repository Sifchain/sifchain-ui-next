import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { Button } from "../Button";

import { Tooltip } from "./";

export default {
  title: "components/Tooltip",
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => {
  return (
    <div className="grid h-screen place-items-center">
      <Tooltip {...args} />
    </div>
  );
};

export const Default = Template.bind({});

Default.args = {
  content: "This is a tooltip",
  children: <Button variant="primary">Hover me</Button>,
};

export const Left = Template.bind({});

Left.args = {
  content: "This is another tooltip",
  placement: "left",
  children: <Button variant="primary">Hover me too!</Button>,
};

export const WithTitle = Template.bind({});

WithTitle.args = {
  content: "This is yet another tooltip",
  title: "Such fancy, much wow!",
  placement: "right",
  children: <Button variant="primary">Hover me, I have a title!</Button>,
};
