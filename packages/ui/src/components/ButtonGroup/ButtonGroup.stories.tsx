import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";

import { ButtonGroup } from ".";

export default {
  title: "components/ButtonGroup",
  component: ButtonGroup,
} as ComponentMeta<typeof ButtonGroup>;

const Template: ComponentStory<typeof ButtonGroup> = (args) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <ButtonGroup {...args} selectedIndex={activeTab} onChange={setActiveTab} />
  );
};

export const Default = Template.bind({});

Default.args = {
  className: "max-w-sm",
  data: [
    {
      label: "Tab 1",
      value: "tab-1",
    },
    {
      label: "Tab 2",
      value: "tab-2",
    },
    {
      label: "Tab 3",
      value: "tab-3",
    },
  ],
};

export const Small = Template.bind({});

Small.args = {
  className: "max-w-sm",
  size: "sm",
  data: [
    {
      label: "Tab 1",
      value: "tab-1",
    },
    {
      label: "Tab 2",
      value: "tab-2",
    },
    {
      label: "Tab 3",
      value: "tab-3",
    },
  ],
};
