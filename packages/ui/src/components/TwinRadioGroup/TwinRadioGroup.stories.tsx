import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";

import { TwinRadioGroup } from ".";

export default {
  title: "components/TwinRadioGroup",
  component: TwinRadioGroup,
} as ComponentMeta<typeof TwinRadioGroup>;

export const Uncontrolled: ComponentStory<typeof TwinRadioGroup> = ({
  name,
  options,
}) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const $form = event.target as HTMLFormElement;
        console.log($form["margin-side-uncontrolled"].value);
      }}
    >
      <p>Using with HTML Form</p>
      <TwinRadioGroup name={name} options={options} />
      <button type="submit">Submit</button>
    </form>
  );
};
Uncontrolled.args = {
  name: "margin-side-uncontrolled",
  options: [
    {
      title: "Long",
      value: "long",
    },
    {
      title: "Short",
      value: "short",
    },
  ],
};

export const Controlled: ComponentStory<typeof TwinRadioGroup> = (args) => {
  const [side, setSide] = useState("short");
  return <TwinRadioGroup {...args} onChange={setSide} value={side} />;
};
Controlled.args = {
  name: "margin-side-controlled",
  options: [
    {
      title: "Long",
      value: "long",
    },
    {
      title: "Short",
      value: "short",
    },
  ],
};
