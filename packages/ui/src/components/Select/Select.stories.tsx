import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";

import { Select } from ".";

export default {
  title: "components/Select",
  component: Select,
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => {
  const [selectedOption, setSelectedOption] = useState(args.options[0]);

  return (
    <Select {...args} onChange={setSelectedOption} value={selectedOption} />
  );
};

export const Default = Template.bind({});

Default.args = {
  label: "Select",
  options: [
    {
      id: "1",
      label: "Option 1",
      body: "This is option 1",
    },
    {
      id: "2",
      label: "Option 2",
      body: "This is option 2",
    },
    {
      id: "3",
      label: "Option 3",
      body: "This is option 3",
    },
  ],
};
