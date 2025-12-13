const DEFAULT_SESSION_COOKIE = "reetry.session";

export function getSessionCookieName() {
  return process.env.SESSION_COOKIE_NAME ?? DEFAULT_SESSION_COOKIE;
}

export function isLoggedInFromCookie(cookieValue?: string | null) {
  return typeof cookieValue === "string" && cookieValue.trim().length > 0;
}
