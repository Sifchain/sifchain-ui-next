import type { ComponentStory, ComponentMeta } from "@storybook/react";
import clsx from "clsx";
import React from "react";

import { RecyclerView } from ".";

export default {
  title: "components/RecyclerView",
  component: RecyclerView,
} as ComponentMeta<typeof RecyclerView>;

const ITEMS_LENGTH = 100000;
const ITEMS = new Array(ITEMS_LENGTH).fill(0).map((_, i) => ({
  id: `item-${i}`,
  value: i + 1,
}));

const Template: ComponentStory<typeof RecyclerView> = (args) => {
  return (
    <RecyclerView
      as="ul"
      className="divide-y-2 divide-gray-500 bg-slate-900/40 text-white ring-1"
      data={ITEMS}
      visibleRows={20}
      rowHeight={50}
      keyExtractor={(item) => item.id}
      renderItem={React.memo(({ item, style }) => (
        <li
          role="button"
          className="flex items-center justify-center transition-all hover:bg-blue-300/60 hover:opacity-80"
          style={style}
        >
          {[
            new Array(10).fill(0).map((_, i) => (
              <div
                className={clsx("grid h-full flex-1 place-items-center", {
                  "bg-indigo-900/40": (item.value + i) % 2 === 0,
                })}
              >
                {item.value + i}
              </div>
            )),
          ]}
        </li>
      ))}
    />
  );
};

export const Default = Template.bind({});

Default.args = {};
