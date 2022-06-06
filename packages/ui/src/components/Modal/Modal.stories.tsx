import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { useEffect, useState } from "react";

import { Modal } from ".";

export default {
  title: "components/Modal",
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => {
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsOpen(true);
      }, 700);
    }
  }, [isOpen]);

  return (
    <Modal
      {...args}
      isOpen={isOpen}
      onGoBack={undefined}
      onClose={() => setIsOpen(false)}
    />
  );
};

export const Default = Template.bind({});

Default.args = {
  isOpen: true,
  title: "Modal title",
  children: <>Hello, I'm in a modal</>,
};
