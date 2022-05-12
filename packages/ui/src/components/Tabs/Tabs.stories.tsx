import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";

import { Tabs } from "./";

export default {
  title: "components/Tabs",
  component: Tabs,
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = (args) => {
  const [activeTab, setActiveTab] = useState(0);
  return <Tabs {...args} selectedIndex={activeTab} onChange={setActiveTab} />;
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
