import { NextMiddleware, NextResponse } from "next/server";
import { readProviderList } from "~/lib/utils";

const handler: NextMiddleware = async (req) => {
  try {
    const { pathname, origin } = req.nextUrl;

    const [, , , providerId] = pathname.split("/");

    const { providers } = await readProviderList(origin);

    const provider = providers.find((provider) => provider.id === providerId);

    return new NextResponse(JSON.stringify(provider), {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        "content-type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(JSON.stringify({ message: error.message }), {
        status: 400,
      });
    } else {
      return new NextResponse(JSON.stringify({ message: "unknown error" }), {
        status: 500,
      });
    }
  }
};

export const config = {
  runtime: "experimental-edge",
};

export default handler;
