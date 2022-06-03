import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { ReactComponent } from ".";

export default {
  title: "components/ReactComponent",
  component: ReactComponent,
} as ComponentMeta<typeof ReactComponent>;

const Template: ComponentStory<typeof ReactComponent> = (args) => {
  return <ReactComponent {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
