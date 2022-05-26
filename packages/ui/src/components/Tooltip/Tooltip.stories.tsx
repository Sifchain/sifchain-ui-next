import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { Button } from "../Button";

import { Tooltip } from "./";

export default {
  title: "components/Tooltip",
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => {
  return <Tooltip {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  content: "This is a tooltip",
  children: <Button variant="primary">Hover me</Button>,
};
