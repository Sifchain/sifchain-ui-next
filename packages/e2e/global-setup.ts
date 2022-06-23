// global-setup.ts
import { extractExtensionPackage, preparePath } from "./utils.js";
import { MM_CONFIG, KEPLR_CONFIG } from "./config.js";
import path from "path";
import fs from "fs";
import { chromium } from "@playwright/test";

async function globalSetup() {
  await extractExtensionPackage(MM_CONFIG.id);
  await extractExtensionPackage(KEPLR_CONFIG.id);
  const dirname = path.resolve(path.dirname(''));
  const pathToKeplrExtension = path.join(dirname, KEPLR_CONFIG.path);
  const pathToMmExtension = path.join(dirname, MM_CONFIG.path);
  const userDataDir = path.join(dirname, "./playwright");
  // need to rm userDataDir or else will store extension state
  if (fs.existsSync(userDataDir)) {
    fs.rmSync(userDataDir, { recursive: true });
  }

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    locale: "en-US",
    timezoneId: "UTC",
    args: [
      `--disable-extensions-except=${pathToKeplrExtension},${pathToMmExtension}`,
      `--load-extension=${pathToKeplrExtension},${pathToMmExtension}`,
    ],
    recordHar: {
      path: `${await preparePath("./logs")}/har.json`,
    },
  });
  console.log("Global setup end");
  const page = await context.pages();
  
}

export default globalSetup;

// afterAll(async () => {
//   await context.close();
// });
