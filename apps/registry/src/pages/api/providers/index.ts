import type { NextApiHandler } from "next";
import { readProviderList } from "~/lib/utils";

const handler: NextApiHandler = async (_req, res) => {
  try {
    const { providers } = await readProviderList();

    res.json(providers);
  } catch (error) {
    res.statusCode = 400;
    if (error instanceof Error) {
      res.end({
        message: `failed to read providers: ${error.message}\n`,
      });
    } else {
      res.end({
        message: `failed to read providers: unknown error\n`,
        originalError: error,
      });
    }
  }
};

export default handler;
