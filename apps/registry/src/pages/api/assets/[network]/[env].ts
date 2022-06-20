import type { NextApiHandler } from "next";
import { readAssetList } from "~/lib/utils";

const VALID_NETWORKS = ["ethereum", "sifchain"];
const VALID_ENVS = ["localnet", "devnet", "testnet", "mainnet"];

const handler: NextApiHandler = async (req, res) => {
  try {
    const { network, env } = req.query;

    if (typeof network !== "string" || !VALID_NETWORKS.includes(network)) {
      throw new Error(`Invalid network: ${network}`);
    }

    if (typeof env !== "string" || !VALID_ENVS.includes(env)) {
      throw new Error(`Invalid env: ${env}`);
    }

    const { assets } = await readAssetList(network, env);

    res.json(assets);
  } catch (error) {
    if (error instanceof Error) {
      res.end({
        message: `failed to read assets: ${error.message}\n`,
      });
    } else {
      res.end({
        message: `failed to read assets: unknown error\n`,
        originalError: error,
      });
    }
  }
};

export default handler;
