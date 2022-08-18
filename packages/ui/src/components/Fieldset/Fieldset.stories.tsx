import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";

import { Fieldset } from ".";
import { Select, SelectOption } from "../Select";

export default {
  title: "components/Fieldset",
  component: Fieldset,
} as ComponentMeta<typeof Fieldset>;

const options: SelectOption[] = [
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
];

const Template: ComponentStory<typeof Fieldset> = (args) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <Fieldset {...args} className="flex gap-2">
      <Select className="flex-1" value={selectedOption} onChange={setSelectedOption} options={options} />
      <Select className="flex-1" value={selectedOption} onChange={setSelectedOption} options={options} />
    </Fieldset>
  );
};

export const Default = Template.bind({});

Default.args = {
  label: "From",
};
