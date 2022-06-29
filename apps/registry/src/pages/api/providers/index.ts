import { NextMiddleware, NextResponse } from "next/server";
import { readProviderList } from "~/lib/utils";

const handler: NextMiddleware = async (req) => {
  try {
    const { providers } = await readProviderList(req.nextUrl.origin);

    return new NextResponse(JSON.stringify(providers), {
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
