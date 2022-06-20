import fs from "fs/promises";
import path from "path";

export async function readAssetList(network: string, env: string) {
  const raw = await fs.readFile(
    path.resolve(
      `./public/config/networks/${network}/assets.${network}.${env}.json`,
    ),
    "utf8",
  );
  return JSON.parse(raw);
}

export async function readProviderList() {
  const raw = await fs.readFile(
    path.resolve(`./public/config/providers/providers.json`),
    "utf8",
  );
  return JSON.parse(raw);
}
