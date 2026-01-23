import { cookies } from "next/headers";
import type { UserResponse } from "@/lib/api/generated/model";
import { UserResponseRole } from "@/lib/api/generated/model";

const DEFAULT_SESSION_COOKIE = "act-local";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export function getSessionCookieName() {
  return process.env.SESSION_COOKIE_NAME ?? DEFAULT_SESSION_COOKIE;
}

export function isLoggedInFromCookie(cookieValue?: string | null) {
  return typeof cookieValue === "string" && cookieValue.trim().length > 0;
}

/**
 * 서버 사이드에서 httpOnly 쿠키를 확인하여 로그인 여부를 반환합니다.
 * 서버 컴포넌트, 서버 액션, Route Handler에서 사용 가능합니다.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieName = getSessionCookieName();
  const cookieValue = cookieStore.get(cookieName)?.value;
  return isLoggedInFromCookie(cookieValue);
}

/**
 * 서버 사이드에서 현재 인증 상태 정보를 가져옵니다.
 */
export async function getAuthState(): Promise<{ isLoggedIn: boolean }> {
  const isLoggedIn = await isAuthenticated();
  return { isLoggedIn };
}

/**
 * 서버 사이드에서 현재 로그인한 유저 정보를 가져옵니다.
 * 쿠키를 포함하여 API를 호출합니다.
 */
export async function getCurrentUser(): Promise<UserResponse | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const response = await fetch(`${BASE_URL}/api/v1/users/me`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    if (!json.success) {
      return null;
    }

    return json.data as UserResponse;
  } catch {
    return null;
  }
}

/**
 * 현재 유저가 어드민 권한을 가지고 있는지 확인합니다.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === UserResponseRole.ADMIN;
}
