import type { NextApiHandler } from "next";
import { readProviderList } from "~/lib/utils";

const handler: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query;

    if (typeof id !== "string") {
      throw new Error("id must be a string");
    }

    const { providers } = await readProviderList();

    const provider = providers.find((p) => p.id === id);

    if (!provider) {
      res.statusCode = 404;
      throw new Error(`provider with id "${id}" not found`);
    }

    res.json(provider);
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
