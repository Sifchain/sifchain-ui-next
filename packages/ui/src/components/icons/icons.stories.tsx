import type { ComponentStory, ComponentMeta } from "@storybook/react";
import type { IconType } from ".";

import * as icons from "./svgr";

export default {
  title: "components/Icons",
  component: icons.ArrowLeftIcon,
} as ComponentMeta<typeof icons.ArrowLeftIcon>;

const Template: ComponentStory<IconType> = (args) => {
  const iconComponents = Object.keys(icons).map(
    (key) => icons[key as keyof typeof icons],
  );
  return (
    <ul className="flex gap-2">
      {iconComponents.map((Icon) => (
        <>
          <li key={Icon.name}>
            <div className="grid place-items-center h-12 w-12 bg-gray-900/40 text-xl text-gray-50 rounded">
              <Icon />
            </div>
          </li>
        </>
      ))}
    </ul>
  );
};

export const Default = Template.bind({});

Default.args = {};
