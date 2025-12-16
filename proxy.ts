import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { LOGIN_PATH, isPublicRoute } from "@/lib/auth/routes";
import { getSessionCookieName, isLoggedInFromCookie } from "@/lib/auth/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const sessionCookieName = getSessionCookieName();
  const cookieValue = request.cookies.get(sessionCookieName)?.value;

  if (!isLoggedInFromCookie(cookieValue)) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"]
};
