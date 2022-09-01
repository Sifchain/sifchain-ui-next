import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { DocumentPlusIcon, FolderPlusIcon, HashtagIcon, TagIcon } from "@heroicons/react/24/outline";

import { CommandPalette } from "./";
import type { CommandPaletteEntry, QuickActionEntry } from "./CommandPalette";

export default {
  title: "compounds/CommandPalette",
  component: CommandPalette,
} as ComponentMeta<typeof CommandPalette>;

const entries: CommandPaletteEntry[] = [
  { id: "1", label: "Something here", url: "#" },
  { id: "2", label: "Another something here", url: "#" },
];

const quickActions: QuickActionEntry[] = [
  { label: "Add new file...", icon: DocumentPlusIcon, url: "#" },
  { label: "Add new folder...", icon: FolderPlusIcon, url: "#" },
  { label: "Add hashtag...", icon: HashtagIcon, url: "#" },
  { label: "Add label...", icon: TagIcon, url: "#" },
];

const Template: ComponentStory<typeof CommandPalette> = (args) => (
  <>
    <CommandPalette {...args} />
  </>
);

export const Default = Template.bind({});

Default.args = {
  quickActions,
  entries,
  query: "",
};
