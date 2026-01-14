import { cookies } from "next/headers";

const DEFAULT_SESSION_COOKIE = "act-local";

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
