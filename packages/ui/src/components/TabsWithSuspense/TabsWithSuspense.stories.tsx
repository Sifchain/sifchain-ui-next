import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { useState, lazy } from "react";

import { TabsWithSuspense } from ".";

export default {
  title: "components/TabsWithSuspense",
  component: TabsWithSuspense,
} as ComponentMeta<typeof TabsWithSuspense>;

const Template: ComponentStory<typeof TabsWithSuspense> = (args) => {
  const [activeTab, setActiveTab] = useState("acme");
  return (
    <TabsWithSuspense
      {...args}
      activeTab={activeTab}
      renderItem={(title, slug) => {
        return (
          <button type="button" onClick={() => setActiveTab(slug)}>
            {title}
          </button>
        );
      }}
    />
  );
};

export const Default = Template.bind({});

Default.args = {
  items: [
    {
      title: "Acme",
      slug: "acme",
      content: lazy(
        () =>
          // we can return `import()` + using timeout to test loading
          new Promise((res) => {
            setTimeout(() => res(import("./fixture/Acme")), 2000);
          }),
      ),
    },
    {
      title: "Tales",
      slug: "tales",
      content: lazy(
        () =>
          // we can return `import()` + using timeout to test loading
          new Promise((res) => {
            setTimeout(() => res(import("./fixture/Tales")), 2000);
          }),
      ),
    },
  ],
  loadingFallback: "Loading...",
};
