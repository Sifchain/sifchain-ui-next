import { NextMiddleware, NextRequest, NextResponse } from "next/server";

export const middleware: NextMiddleware = (req, res) => {
  console.log("pathname", req.nextUrl.pathname);

  return NextResponse.next({
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
};

export const config = {
  matcher: [
    "/api/assets/:network/:env",
    "/api/providers",
    "/api/providers/:id",
  ],
};
