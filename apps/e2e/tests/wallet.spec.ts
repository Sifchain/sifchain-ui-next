import { expect, test } from "@playwright/test";

test("can connect to mnemonic wallet", async ({ page }) => {
  await page.goto("http://localhost:3001/");

  const connectWallet = page.locator("text=Connect wallets");
  await connectWallet.click();

  const sifchainWallet = page.locator("li:has-text('Sifchain')");
  await sifchainWallet.waitFor();
  await sifchainWallet.click();

  page.on("dialog", (dialog) => void dialog.accept(process.env["COSMOS_MNEMONIC"]));

  const mnemonicWallet = page.locator("li:has-text('Mnemonic')");
  await mnemonicWallet.waitFor();
  await mnemonicWallet.click();

  await connectWallet.waitFor({ state: "detached" });

  const activeConnection = await page.evaluate(() => localStorage.getItem("@@cosmConnectActiveConnection"));

  expect(activeConnection).toBe(JSON.stringify("directSecp256k1HdWallet"));
});
