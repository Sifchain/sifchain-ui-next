import type { ComponentStory, ComponentMeta } from "@storybook/react";

import * as messages from "./FlashMessages";

export default {
  title: "components/FlashMessage",
  component: messages.FlashMessage,
} as ComponentMeta<typeof messages.FlashMessage>;

/**
 * ================================================================================================
 *
 * FlashMessage
 *
 * ================================================================================================
 */
const TemplateFlashMessage: ComponentStory<typeof messages.FlashMessage> = (args) => {
  return (
    <div className="grid h-screen place-items-center">
      <messages.FlashMessage {...args} />
    </div>
  );
};

export const FlashMessage = TemplateFlashMessage.bind({});
FlashMessage.args = {
  children:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam iusto fugiat iste asperiores, non amet eligendi vitae culpa, aperiam voluptates accusamus voluptatem quibusdam modi maxime facere aliquam quae saepe quaerat.",
};

export const FlashMessageFullPage = TemplateFlashMessage.bind({});
FlashMessageFullPage.args = {
  size: "full-page",
  children:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam iusto fugiat iste asperiores, non amet eligendi vitae culpa, aperiam voluptates accusamus voluptatem quibusdam modi maxime facere aliquam quae saepe quaerat.",
};

/**
 * ================================================================================================
 *
 * FlashMessageAccountNotWhitelisted
 *
 * ================================================================================================
 */
const TemplateFlashMessageAccountNotWhitelisted: ComponentStory<typeof messages.FlashMessageAccountNotWhitelisted> = (
  args,
) => {
  return (
    <div className="grid h-screen place-items-center">
      <messages.FlashMessageAccountNotWhitelisted {...args} />
    </div>
  );
};
export const FlashMessageAccountNotWhitelisted = TemplateFlashMessageAccountNotWhitelisted.bind({});
FlashMessageAccountNotWhitelisted.args = {};

/**
 * ================================================================================================
 *
 * FlashMessageAccountNotWhitelisted
 *
 * ================================================================================================
 */
const TemplateFlashMessage5xxError: ComponentStory<typeof messages.FlashMessage5xxError> = (args) => {
  return (
    <div className="grid h-screen place-items-center">
      <messages.FlashMessage5xxError {...args} />
    </div>
  );
};

export const FlashMessage5XXError = TemplateFlashMessage5xxError.bind({});
FlashMessage5XXError.args = {};

export const FlashMessage5XXErrorFullPage = TemplateFlashMessage5xxError.bind({});
FlashMessage5XXErrorFullPage.args = {
  size: "full-page",
};

/**
 * ================================================================================================
 *
 * FlashMessageAccountNotWhitelisted
 *
 * ================================================================================================
 */
const TemplateFlashMessageLoading: ComponentStory<typeof messages.FlashMessageLoading> = (args) => {
  return (
    <div className="grid h-screen place-items-center">
      <messages.FlashMessageLoading {...args} />
    </div>
  );
};

export const FlashMessageLoading = TemplateFlashMessageLoading.bind({});
FlashMessageLoading.args = {};

export const FlashMessageLoadingFullPage = TemplateFlashMessageLoading.bind({});
FlashMessageLoadingFullPage.args = {
  size: "full-page",
};

/**
 * ================================================================================================
 *
 * FlashMessageAccountNotWhitelisted
 *
 * ================================================================================================
 */
const TemplateFlashMessageConnectSifChainWallet: ComponentStory<typeof messages.FlashMessageConnectSifChainWallet> = (
  args,
) => {
  return (
    <div className="grid h-screen place-items-center">
      <messages.FlashMessageConnectSifChainWallet {...args} />
    </div>
  );
};

export const FlashMessageConnectSifChainWallet = TemplateFlashMessageConnectSifChainWallet.bind({});
FlashMessageConnectSifChainWallet.args = {};

export const FlashMessageConnectSifChainWalletFullPage = TemplateFlashMessageConnectSifChainWallet.bind({});
FlashMessageConnectSifChainWalletFullPage.args = {
  size: "full-page",
};

/**
 * ================================================================================================
 *
 * FlashMessageAccountNotWhitelisted
 *
 * ================================================================================================
 */
const TemplateFlashMessageConnectSifChainWalletError: ComponentStory<
  typeof messages.FlashMessageConnectSifChainWalletError
> = (args) => {
  return (
    <div className="grid h-screen place-items-center">
      <messages.FlashMessageConnectSifChainWalletError {...args} />
    </div>
  );
};

export const FlashMessageConnectSifChainWalletError = TemplateFlashMessageConnectSifChainWalletError.bind({});
FlashMessageConnectSifChainWalletError.args = {};

export const FlashMessageConnectSifChainWalletErrorFullPage = TemplateFlashMessageConnectSifChainWalletError.bind({});
FlashMessageConnectSifChainWalletErrorFullPage.args = {
  size: "full-page",
};

/**
 * ================================================================================================
 *
 * FlashMessageAccountNotWhitelisted
 *
 * ================================================================================================
 */
const TemplateFlashMessageConnectSifChainWalletLoading: ComponentStory<
  typeof messages.FlashMessageConnectSifChainWalletLoading
> = (args) => {
  return (
    <div className="grid h-screen place-items-center">
      <messages.FlashMessageConnectSifChainWalletLoading {...args} />
    </div>
  );
};

export const FlashMessageConnectSifChainWalletLoading = TemplateFlashMessageConnectSifChainWalletLoading.bind({});
FlashMessageConnectSifChainWalletLoading.args = {};

export const FlashMessageConnectSifChainWalletLoadingFullPage = TemplateFlashMessageConnectSifChainWalletLoading.bind(
  {},
);
FlashMessageConnectSifChainWalletLoadingFullPage.args = {
  size: "full-page",
};
