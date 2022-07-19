import type { NextApiHandler } from "next";
import { readAssetList } from "~/lib/utils";
// import withCorsMiddleware from "~/lib/withCorsMiddleware";

const VALID_NETWORKS = ["ethereum", "sifchain"];
const VALID_ENVS = ["localnet", "devnet", "testnet", "mainnet"];

const handler: NextApiHandler = async (req, res) => {
  let statusCode: number | undefined;

  try {
    const { network, env } = req.query;
    const protocol = req.headers.host?.includes("localhost") ? "http" : "https";

    if (typeof network !== "string" || !VALID_NETWORKS.includes(network)) {
      statusCode = 400;
      throw new Error(`Invalid network: ${network}`);
    }

    if (typeof env !== "string" || !VALID_ENVS.includes(env)) {
      statusCode = 400;
      throw new Error(`Invalid env: ${env}`);
    }

    const { assets } = await readAssetList(
      `${protocol}://${req.headers.host}`,
      network,
      env,
    );

    res
      .setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate")
      .json(assets);
  } catch (error) {
    console.error("failed to serve assets", { error });
    if (error instanceof Error) {
      res.status(statusCode ?? 400).json({ error: error.message });
    } else {
      res
        .status(statusCode ?? 500)
        .json({ error: "unknow error proceccing: /api/assets" });
    }
  }
};

export const config = {
  runtime: "experimental-edge",
};

export default handler;
