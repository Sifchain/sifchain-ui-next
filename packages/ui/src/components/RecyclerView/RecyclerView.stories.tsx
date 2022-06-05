import type { ComponentStory, ComponentMeta } from "@storybook/react";

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
      className="bg-slate-100 ring-1"
      data={ITEMS}
      visibleRows={20}
      rowHeight={50}
      keyExtractor={(item) => item.id}
      renderItem={(item) => (
        <li
          role="button"
          className="grid place-items-center ring-1 hover:opacity-80 hover:bg-blue-300/60 transition-all"
        >
          Row: {item.value}
        </li>
      )}
    />
  );
};

export const Default = Template.bind({});

Default.args = {};
