import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";

import { Toggle } from "./";

export default {
  title: "components/Toggle",
  component: Toggle,
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = (args) => {
  const [isChecked, setIsChecked] = useState(false);
  return <Toggle {...args} checked={isChecked} onChange={setIsChecked} />;
};

export const Default = Template.bind({});

Default.args = {};
