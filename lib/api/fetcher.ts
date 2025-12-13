const API_BASE_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type ParseAs = "json" | "text";

export type ApiRequestOptions = {
  init?: RequestInit;
  timeoutMs?: number;
  parseAs?: ParseAs;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  detail?: unknown;

  constructor(status: number, message: string, code?: string, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

const DEFAULT_TIMEOUT = 8000;

function resolveUrl(path: string) {
  if (path.startsWith("http")) {
    return path;
  }

  const base = API_BASE_URL || "";

  if (!base) {
    console.warn("API_BASE_URL is not set. Relative paths will be used as-is.");
    return path;
  }

  return new URL(path, base).toString();
}

async function request<T>(
  path: string,
  method: HttpMethod,
  body?: BodyInit | null,
  options?: ApiRequestOptions
): Promise<T> {
  const { init, timeoutMs = DEFAULT_TIMEOUT, parseAs = "json" } = options ?? {};
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers = new Headers(init?.headers);

  if (body && !headers.has("Content-Type") && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(resolveUrl(path), {
      method,
      body,
      credentials: init?.credentials ?? "include",
      signal: controller.signal,
      ...init,
      headers
    });

    if (!response.ok) {
      let detail: unknown;
      let message = response.statusText;

      try {
        detail = await response.json();
        message = (detail as { message?: string })?.message ?? message;
      } catch {
        // ignore parse failure and fallback to statusText
      }

      throw new ApiError(response.status, message, (detail as { code?: string })?.code, detail);
    }

    if (parseAs === "text") {
      return (await response.text()) as T;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(408, "Request timed out");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function apiGet<T>(path: string, options?: ApiRequestOptions) {
  return request<T>(path, "GET", null, options);
}

export async function apiPost<TBody extends Record<string, unknown>, TResp>(
  path: string,
  body: TBody,
  options?: ApiRequestOptions
) {
  const payload = body instanceof FormData ? body : JSON.stringify(body);
  return request<TResp>(path, "POST", payload, options);
}

// Authentication relies on HttpOnly cookies issued by the backend.
// Never persist tokens in localStorage/sessionStorage on this UI surface.
