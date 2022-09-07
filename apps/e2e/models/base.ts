import type { Page } from "@playwright/test";

export default abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract navigate(): Promise<unknown>;

  async connectMnemonicWallet(mnemonic?: string) {
    const connectWallet = this.page.locator("text=Connect wallets");
    await connectWallet.click();

    const sifchainWallet = this.page.locator("li:has-text('Sifchain')");
    await sifchainWallet.waitFor();
    await sifchainWallet.click();

    this.page.on("dialog", (dialog) => void dialog.accept(mnemonic ?? process.env["COSMOS_MNEMONIC"]));

    const mnemonicWallet = this.page.locator("li:has-text('Mnemonic')");
    await mnemonicWallet.waitFor();
    await mnemonicWallet.click();

    await connectWallet.waitFor({ state: "detached" });
  }
}
