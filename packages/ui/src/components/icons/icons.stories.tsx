import type { ComponentStory, ComponentMeta } from "@storybook/react";
import type { IconType } from ".";
import { Tooltip } from "../Tooltip";

import * as icons from "./svgr";

export default {
  title: "components/Icons",
  component: icons.ArrowLeftIcon,
} as ComponentMeta<typeof icons.ArrowLeftIcon>;

const Template: ComponentStory<IconType> = () => {
  const iconComponents = Object.keys(icons).map((key) => icons[key as keyof typeof icons]);
  return (
    <ul className="flex flex-wrap gap-2">
      {iconComponents.map((Icon) => (
        <>
          <li key={Icon.name}>
            <Tooltip content={Icon.name}>
              <div className="grid h-12 w-12 place-items-center rounded bg-gray-900/40 text-xl text-gray-50">
                <Icon />
              </div>
            </Tooltip>
          </li>
        </>
      ))}
    </ul>
  );
};

export const Default = Template.bind({});

Default.args = {};
