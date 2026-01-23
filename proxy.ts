import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { LOGIN_PATH, isPublicRoute } from "@/lib/auth/routes";
import { getSessionCookieName, isLoggedInFromCookie } from "@/lib/auth/session";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

async function checkIsAdmin(cookieHeader: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/users/me`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return false;
    }

    const json = await response.json();
    if (!json.success) {
      return false;
    }

    return json.data?.role === "ADMIN" || json.data?.role === "SUPER_ADMIN";
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
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

  // admin 경로 접근 시 권한 체크
  if (isAdminRoute(pathname)) {
    const cookieHeader = request.cookies
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const isAdmin = await checkIsAdmin(cookieHeader);

    if (!isAdmin) {
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images|favicon.ico|robots.txt).*)"]
};
