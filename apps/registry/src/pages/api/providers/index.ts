import type { NextApiHandler } from "next";
import { readProviderList } from "~/lib/utils";

const handler: NextApiHandler = async (req, res) => {
  try {
    const protocol = req.headers.host?.includes("localhost") ? "http" : "https";
    const { providers } = await readProviderList(
      `${protocol}://${req.headers.host}`,
    );

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

    res.status(200).json(providers);
  } catch (error) {
    console.error("failed to serve providers", { error });
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res
        .status(500)
        .json({ error: "unknow error proceccing: /api/providers" });
    }
  }
};

export const config = {
  runtime: "experimental-edge",
};

export default handler;
