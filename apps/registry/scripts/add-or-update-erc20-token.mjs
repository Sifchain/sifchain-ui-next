#!/usr/bin/env zx

import chalk from "chalk";
import CoingeckoClient from "coingecko-api";
import fs from "fs/promises";
import path from "path";
import { uniqBy } from "ramda";
import Web3 from "web3";

import { ERC20_ABI } from "./erc20TokenAbi.mjs";
import { arg, prompt } from "./lib.mjs";

const coingeckoClient = new CoingeckoClient();

const args = arg(
  {
    // args
    "--address": String,
    "--envs": String,
    // aliases
    "-i": "--id",
    "-e": "--envs",
    "-a": "--address",
  },
  `
Usage: 

  npm run add-or-update-token [--address|-a <address>] [--envs <envs>]
`,
);

const VALID_ENVS = [
  "localnet",
  "devnet",
  "testnet",
  "mainnet",
  "sifchain-devnet",
  "sifchain-mainnet",
];

const { eth } = new Web3(
  new Web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/93cd052103fd44bd9cf855654e5804ac",
  ),
);

async function getERC20Info(address = "") {
  const contract = new eth.Contract(ERC20_ABI, address);

  const [decimals, tokenName, symbol] = await Promise.all([
    contract.methods.decimals().call(),
    contract.methods.name().call(),
    contract.methods.symbol().call(),
  ]);

  return {
    name: String(tokenName),
    symbol: String(symbol),
    decimals: Number(decimals),
  };
}

/**
 *
 * @param {'sifchain'|'ethereum'|string} network
 * @param {'localnet'|'devnet'|'testnet'|'mainnet'|string} env
 * @returns
 */
function getAssetFilePath(network, env) {
  const filePrefix = path.resolve("./public/config/networks");
  const filePath = `${filePrefix}/${network}/assets.${network}.${env}.json`;
  return filePath;
}

/**
 *
 * @param {'sifchain'|'ethereum'|string} network
 * @param {'localnet'|'devnet'|'testnet'|'mainnet'|string} env
 * @param {{
 *  address: string,
 *  symbol: string,
 * }} assetConfig
 * @returns
 */
async function updateAssetByNetwork(network, env, assetConfig) {
  console.log("Updating network asset", { network, env });

  const filePath = getAssetFilePath(network, env);
  const assetRaw = await fs.readFile(filePath, "utf8");

  /**
   * @type {{
   *  assets: Array<{
   *    address: string;
   *    symbol: string;
   *  }>
   * }}
   */
  const { assets } = JSON.parse(assetRaw);

  const existingAsset = assets.find(
    (asset) => asset.address === assetConfig.address,
  );

  if (existingAsset) {
    const answer = await prompt(
      chalk.red(
        `asset already exists for (${network}, ${env}). \r\n Would you like to replace the config?`,
      ),
      ["y", "n"],
      "y",
    );
    if (answer === "n") {
      console.log("skipping asset update");
      process.exit(0);
    }
  }

  const nextAssets = uniqBy((x) => x.symbol, assets.concat(assetConfig));

  const encodedFile = JSON.stringify({ assets: nextAssets }, null, 2);

  await fs.writeFile(filePath, encodedFile);

  console.log(
    chalk.green(`Successfully ${existingAsset ? "updated" : "added"} asset`),
    {
      network,
      env,
    },
  );

  process.exit(0);
}

/**
 * @param {{
 *  address: string,
 *  id: string,
 *  envs: string[],
 * }} options
 * @returns
 */
async function addOrUpdateToken({ address = "", envs = [] }) {
  if (!envs.length) {
    throw new Error("At least one env is required");
  }

  if (!address) {
    throw new Error("Address is required");
  }

  try {
    const token = await getERC20Info(address);

    console.log("token", token);

    const coinInfo = await coingeckoClient.coins.fetchCoinContractInfo(address);

    const coinId = String(coinInfo?.data?.id);

    if (!coinId) {
      throw new Error("Coin id is not found for address: " + address);
    }

    const response = await coingeckoClient.coins.fetch(coinId, {});

    if (response.code !== 200) {
      console.log("something went weird", {
        code: response.code,
        message: response.message,
      });
    }

    const ethAssetConfig = {
      address,
      symbol: response.data.symbol,
      displaySymbol: response.data.symbol,
      decimals: token.decimals,
      name: response.data.name,
      imageUrl: response.data.image.small,
      network: "ethereum",
      homeNetwork: "ethereum",
    };

    const sifAssetConfig = {
      ...ethAssetConfig,
      network: "sifchain",
      symbol: `c${ethAssetConfig.symbol}`,
    };

    console.log("Asset config preview:", {
      "EVM config": ethAssetConfig,
      "Sifchain config": sifAssetConfig,
    });

    const { name, symbol } = ethAssetConfig;

    const answer = await prompt(
      chalk.blue(
        `Add "${name}" (${symbol.toUpperCase()}) to envs (${envs.join(", ")})?`,
      ),
      ["y", "n"],
      "y",
    );

    if (answer !== "y") {
      console.log(chalk.blue`Ok, maybe next time.`);
      process.exit(0);
    }

    for (let env of envs) {
      const promises = ["ethereum", "sifchain"].map((network) => {
        const assetConfig =
          network === "ethereum" ? ethAssetConfig : sifAssetConfig;

        return updateAssetByNetwork(network, env, assetConfig);
      });
      await Promise.all(promises);
    }
  } catch (error) {
    console.error(error);
  }
}

await addOrUpdateToken({
  address: args["--address"],
  envs: (args["--envs"] ?? "").split(",").filter(
    /**
     * @param {string} env
     * @returns
     */
    (env) => VALID_ENVS.includes(env),
  ),
});
