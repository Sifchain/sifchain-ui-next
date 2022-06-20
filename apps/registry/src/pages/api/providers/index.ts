import Cors from "cors";
import type { NextApiHandler } from "next";

import initMiddleware from "~/lib/initMiddleware";
import { readProviderList } from "~/lib/utils";

const corsMiddleware = initMiddleware(
  Cors({
    methods: ["GET", "OPTIONS"],
    origin: "*",
  }),
);

const handler: NextApiHandler = async (_req, res) => {
  try {
    const { providers } = await readProviderList();

    res.json(providers);
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

export default handler;
