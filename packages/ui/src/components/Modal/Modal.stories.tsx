import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { Modal } from ".";

export default {
  title: "components/Modal",
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => {
  return <Modal {...args} />;
};

export const Default = Template.bind({});

Default.args = {};

