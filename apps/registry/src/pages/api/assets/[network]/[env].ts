import { NextMiddleware, NextResponse } from "next/server";
import { EDGE_RUNTIME } from "~/lib/configs";

import { readAssetList } from "~/lib/utils";

const VALID_NETWORKS = ["ethereum", "sifchain"];
const VALID_ENVS = ["localnet", "devnet", "testnet", "mainnet"];

const handler: NextMiddleware = async (req) => {
  let statusCode: number | undefined;

  try {
    const { pathname, origin } = req.nextUrl;
    const [, , , network, env] = pathname.split("/");

    if (typeof network !== "string" || !VALID_NETWORKS.includes(network)) {
      statusCode = 400;
      throw new Error(`Invalid network: ${network}`);
    }

    if (typeof env !== "string" || !VALID_ENVS.includes(env)) {
      statusCode = 400;
      throw new Error(`Invalid env: ${env}`);
    }

    const { assets } = await readAssetList(origin, network, env);

    return new NextResponse(JSON.stringify(assets), {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        "content-type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(JSON.stringify({ message: error.message }), {
        status: statusCode ?? 400,
      });
    } else {
      return new NextResponse(JSON.stringify({ message: "unknown error" }), {
        status: statusCode ?? 500,
      });
    }
  }
};

export const config = EDGE_RUNTIME;

export default handler;
