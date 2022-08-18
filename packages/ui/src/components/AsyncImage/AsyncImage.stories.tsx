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
  placeholder: <RacetrackSpinnerIcon className="h-36 w-36 place-self-center" />,
  height: 300,
  width: 300,
  containerClassName: "ring ring-gray-400 rounded shadow-lg shadow-black/70",
};

export const Round = Template.bind({});

Round.args = {
  src: "https://picsum.photos/300/300",
  placeholder: <RacetrackSpinnerIcon className="h-36 w-36 place-self-center" />,
  height: 300,
  width: 300,
  containerClassName: "ring ring-gray-400 rounded-full shadow-lg shadow-black/70",
};
