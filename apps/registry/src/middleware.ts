import { type NextMiddleware, NextResponse } from "next/server";

export const middleware: NextMiddleware = () => {
  return NextResponse.next({
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
};

export const config = {
  matcher: ["/api/assets/:path*", "/api/providers/:path*"],
};
