// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { hasFeatureFlag } from "./lib/featureFlags";

// This function can be marked `async` if using `await` inside
export function middleware(_request: NextRequest) {
  // if (hasFeatureFlag("margin-standalone")) {
  //   return NextResponse.redirect(new URL("/margin", request.url));
  // }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [],
};
