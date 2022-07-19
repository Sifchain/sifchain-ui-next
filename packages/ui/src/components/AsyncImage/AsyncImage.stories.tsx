import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { AsyncImage } from ".";
import { RacetrackSpinnerIcon } from "../icons";

export default {
  title: "components/AsyncImage",
  component: AsyncImage,
} as ComponentMeta<typeof AsyncImage>;

const Template: ComponentStory<typeof AsyncImage> = (args) => {
  return <AsyncImage {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  src: "https://picsum.photos/300/300",
  placeholder: (
    <figure className="grid place-items-center">
      <RacetrackSpinnerIcon />
    </figure>
  ),
  height: 300,
  width: 300,
  className: "ring ring-gray-400 rounded shadow-lg shadow-black/70",
};
