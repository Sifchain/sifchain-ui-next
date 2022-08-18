import chalk from "chalk";
import { promises as fs } from "fs";
import { arg, prompt } from "./lib.mjs";

const args = arg(
  {
    // args
    "--network": String,
    "--env": String,
    // aliases
    "-n": "--network",
    "-e": "--env",
  },
  `
Usage: 

  npm run prettify-assets [--network|-n <"ethereum" | "sifchain">] [--env|-e <"devnet" | "testnet" | "mainnet">]
`,
);

async function readAssetsFile(env = "mainnet", network = "ethereum") {
  const file = await fs.readFile(`./public/config/networks/${network}/assets.${network}.${env}.json`, "utf-8");
  return JSON.parse(file);
}

async function writeAssetsFile(assets = [], env = "mainnet", network = "ethereum") {
  const currentAssets = await readAssetsFile(env, network);

  const fileContent = JSON.stringify({ ...currentAssets, assets }, null, 2);

  await fs.writeFile(`./public/config/networks/${network}/assets.${network}.${env}.json`, fileContent);
}

function transform(key = "", value = "") {
  switch (key) {
    case "symbol":
      return value.toUpperCase();
    default:
      return value;
  }
}

async function prettify({ env, network }) {
  const { assets } = await readAssetsFile(env, network);

  const answer = await prompt(
    chalk.blue(`Would you like to prettify ${assets.length} asset configs?`),
    ["y", "n"],
    "y",
  );

  if (answer !== "y") {
    console.log("ok, see you...");
    process.exit(0);
  }

  const nextAssets = assets.map((asset) => {
    const keys = Object.keys(asset).sort((a, b) => a.localeCompare(b));

    return keys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: transform(key, asset[key]),
      }),
      {},
    );
  });

  console.log(chalk.blue(`Prettifying assets file ${network}/assets.${network}.${env}.json`));

  await writeAssetsFile(nextAssets, env, network);

  console.log(chalk.green`All done 🎉`);
  process.exit(0);
}

prettify({
  env: args["--env"] || "mainnet",
  network: args["--network"] || "ethereum",
});
