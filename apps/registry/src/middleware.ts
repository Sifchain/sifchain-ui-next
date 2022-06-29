// middleware.ts
import { NextMiddleware, NextRequest, NextResponse } from "next/server";

// If the incoming request has the "beta" cookie
// then we'll rewrite the request to /beta
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
