// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasFeatureFlag } from "./lib/featureFlags";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (
    hasFeatureFlag("margin-standalone") &&
    !request.url.includes("localhost:3001")
  ) {
    return NextResponse.redirect(new URL("/margin", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/swap", "/pools", "/changelog", "/balances", "/legacypools"],
};
