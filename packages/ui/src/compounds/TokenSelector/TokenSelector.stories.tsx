import type { ComponentStory, ComponentMeta } from "@storybook/react";

import { tokens } from "./TokenSelector.data";
import { TokenSelector } from ".";

export default {
  title: "compounds/TokenSelector",
  component: TokenSelector,
} as ComponentMeta<typeof TokenSelector>;

export const Default: ComponentStory<typeof TokenSelector> = (args) => {
  return <TokenSelector {...args} />;
};
Default.args = {
  label: "Token",
  modalTitle: "From",
  tokens: [...tokens],
};

export const FixedWidthParent: ComponentStory<typeof TokenSelector> = (
  args,
) => {
  return (
    <div className="text-gray-200">
      <ol className="list-decimal pl-4 mb-4">
        <li>TokenSelctor respects the parent width</li>
        <li>Adds text ellipsis when overflow</li>
        <li>Do not break text in new line</li>
        <li>Label is optional</li>
      </ol>
      <TokenSelector {...args} />
    </div>
  );
};
FixedWidthParent.args = {
  modalTitle: "From",
  tokens: [...tokens],
  buttonClassName: "max-w-[140px]",
};

export const SizeAndButtonCustomization: ComponentStory<
  typeof TokenSelector
> = (args) => {
  return (
    <div className="text-gray-200">
      <ol className="list-decimal pl-4 mb-4">
        <li>You can add extra classes to style the button container</li>
        <li>Change the size of icons and text via `size` property</li>
      </ol>

      <TokenSelector {...args} />
    </div>
  );
};

SizeAndButtonCustomization.args = {
  modalTitle: "From",
  tokens: [...tokens],
  size: "xs",
  buttonClassName: "max-w-[120px]",
};

export const Readonly: ComponentStory<typeof TokenSelector> = (args) => {
  return (
    <div className="text-gray-200">
      <ol className="list-decimal pl-4 mb-4">
        <li>You use `readonly` option to disable interactivity</li>
        <li>The icon will change to a lock, indicating you can't change it</li>
      </ol>
      <TokenSelector {...args} />
    </div>
  );
};
Readonly.args = {
  modalTitle: "From",
  tokens: [...tokens],
  readonly: true,
  buttonClassName: "max-w-[255px]",
};
