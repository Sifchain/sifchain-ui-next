import type { NextApiHandler } from "next";

import { readProviderList } from "~/lib/utils";
import withCorsMiddleware from "~/lib/withCorsMiddleware";

const handler: NextApiHandler = async (_req, res) => {
  try {
    const { providers } = await readProviderList();

    res
      .setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate")
      .json(providers);
  } catch (error) {
    if (error instanceof Error) {
      res.status(res.statusCode ?? 400).send({
        message: `Failed to process request: ${error.message}`,
      });
    } else {
      res.status(res.statusCode ?? 500).send({
        message: `Failed to process request: unknown error`,
        originalError: error,
      });
    }
  }
};

export const config = {
  runtime: "experimental-edge",
};

export default withCorsMiddleware(handler);
