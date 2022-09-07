import { expect, test } from "@playwright/test";
import HomePage from "../models/home";

test("can connect to mnemonic wallet", async ({ browser }) => {
  const page = await browser.newPage();
  const homePage = new HomePage(page);

  await homePage.navigate();
  await homePage.connectMnemonicWallet();

  const activeConnection = await page.evaluate(() => localStorage.getItem("@@cosmConnectActiveConnection"));

  expect(activeConnection).toBe(JSON.stringify("directSecp256k1HdWallet"));
});
