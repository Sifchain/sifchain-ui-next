import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { DocumentAddIcon, FolderAddIcon, HashtagIcon, TagIcon } from "@heroicons/react/outline";

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
  { label: "Add new file...", icon: DocumentAddIcon, url: "#" },
  { label: "Add new folder...", icon: FolderAddIcon, url: "#" },
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
