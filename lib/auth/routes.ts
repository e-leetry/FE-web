export const LOGIN_PATH = "/login";
export const AUTH_CALLBACK_PREFIX = "/auth/callback";

export const publicRoutes = ["/", LOGIN_PATH, AUTH_CALLBACK_PREFIX];
export const authRoutes = [LOGIN_PATH];

export const oauthProviders = ["google", "apple", "kakao"] as const;
export type OAuthProvider = (typeof oauthProviders)[number];

const dynamicRoutePrefixes = new Set([AUTH_CALLBACK_PREFIX]);

export function isPublicRoute(pathname: string) {
  return publicRoutes.some((route) => matchesRoute(pathname, route));
}

export function matchesRoute(pathname: string, candidate: string) {
  if (dynamicRoutePrefixes.has(candidate)) {
    return pathname.startsWith(candidate);
  }

  return pathname === candidate;
}

export function buildAuthorizeUrl(provider: OAuthProvider) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? "";
  if (!base) {
    // fall back to a relative path so local dev still works when envs are missing
    return `/auth/${provider}/authorize`;
  }

  return new URL(`/oauth2/${provider}/authorize`, base).toString();
}

export function buildCallbackPath(provider: OAuthProvider) {
  return `${AUTH_CALLBACK_PREFIX}/${provider}`;
}

export function buildLoginRedirect(pathname: string) {
  const redirect = new URL(LOGIN_PATH, "http://localhost");
  redirect.searchParams.set("redirectTo", pathname);
  return `${LOGIN_PATH}?${redirect.searchParams.toString()}`;
}
