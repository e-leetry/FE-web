import { ApiResponse, ApiClientError, RequestOptions } from "./types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const DEFAULT_TIMEOUT = 10 * 1000;
const isDev = process.env.NODE_ENV === "development";

// 토큰 갱신 함수
const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include"
    });
    return response.ok;
  } catch {
    return false;
  }
};

// 개발 환경 로깅
const logRequest = (method: string, endpoint: string, body?: unknown) => {
  if (!isDev) return;
  console.log(`[API 요청] ${method} ${endpoint}`, body ? { body } : "");
};

const logResponse = <T>(method: string, endpoint: string, data: T, duration: number) => {
  if (!isDev) return;
  console.log(`[API 응답] ${method} ${endpoint} (${duration}ms)`, { data });
};

const logError = (method: string, endpoint: string, error: unknown) => {
  if (!isDev) return;
  console.error(`[API 에러] ${method} ${endpoint}`, error);
};

// URL 생성
const buildUrl = (endpoint: string): string => {
  if (endpoint.startsWith("http")) {
    return endpoint;
  }
  return `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
};

// 메인 fetch 래퍼
const apiFetch = async <T>(
  method: string,
  endpoint: string,
  body?: unknown,
  options?: RequestOptions,
  isRetry = false
): Promise<T> => {
  const { headers = {}, timeout = DEFAULT_TIMEOUT, parseAs = "json" } = options ?? {};
  const startTime = Date.now();

  // AbortController로 타임아웃 처리
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // 외부에서 전달된 signal과 내부 타임아웃 signal 결합
  if (options?.signal) {
    options.signal.addEventListener('abort', () => controller.abort());
  }

  // FormData인 경우 Content-Type 헤더 설정하지 않음 (브라우저가 자동 설정)
  const isFormData = body instanceof FormData;
  const requestHeaders: Record<string, string> = { ...headers };

  if (!isFormData && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  logRequest(method, endpoint, body);

  try {
    const response = await fetch(buildUrl(endpoint), {
      method,
      credentials: "include",
      headers: requestHeaders,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      signal: controller.signal
    });

    // 401 Unauthorized - 토큰 갱신 후 재시도
    if (response.status === 401 && !isRetry) {
      const refreshed = await refreshToken();
      if (refreshed) {
        return apiFetch<T>(method, endpoint, body, options, true);
      }
      throw new ApiClientError(401, "UNAUTHORIZED", "인증이 만료되었습니다. 다시 로그인해주세요.");
    }

    // HTTP 에러 처리 (4xx, 5xx)
    if (!response.ok) {
      let errorMessage = response.statusText;
      let errorCode = `HTTP_${response.status}`;

      try {
        const errorBody = await response.json();
        if (errorBody.error) {
          errorCode = errorBody.error.code ?? errorCode;
          errorMessage = errorBody.error.message ?? errorMessage;
        }
      } catch {
        // JSON 파싱 실패 시 기본 에러 메시지 사용
      }

      throw new ApiClientError(response.status, errorCode, errorMessage);
    }

    // 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    // text 응답 처리
    if (parseAs === "text") {
      const text = await response.text();
      const duration = Date.now() - startTime;
      logResponse(method, endpoint, text, duration);
      return text as T;
    }

    const json: ApiResponse<T> = await response.json();
    const duration = Date.now() - startTime;

    // 비즈니스 로직 에러 (success: false)
    if (!json.success) {
      const error = json.error;
      logError(method, endpoint, error);
      throw new ApiClientError(
        response.status,
        error?.code ?? "UNKNOWN_ERROR",
        error?.message ?? "요청 처리 중 오류가 발생했습니다."
      );
    }

    logResponse(method, endpoint, json.data, duration);
    return json.data as T;
  } catch (error) {
    // 타임아웃 에러
    if (error instanceof Error && error.name === "AbortError") {
      const timeoutError = new ApiClientError(408, "TIMEOUT", "요청 시간이 초과되었습니다.");
      logError(method, endpoint, timeoutError);
      throw timeoutError;
    }

    // 네트워크 에러
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      const networkError = new ApiClientError(0, "NETWORK_ERROR", "네트워크 연결을 확인해주세요.");
      logError(method, endpoint, networkError);
      throw networkError;
    }

    // ApiClientError는 그대로 throw
    if (error instanceof ApiClientError) {
      logError(method, endpoint, error);
      throw error;
    }

    // 기타 에러
    logError(method, endpoint, error);
    throw new ApiClientError(500, "UNKNOWN_ERROR", "알 수 없는 오류가 발생했습니다.");
  } finally {
    clearTimeout(timeoutId);
  }
};

// API 메서드 객체
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    return apiFetch<T>("GET", endpoint, undefined, options);
  },

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> => {
    return apiFetch<T>("POST", endpoint, body, options);
  },

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> => {
    return apiFetch<T>("PUT", endpoint, body, options);
  },

  delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    return apiFetch<T>("DELETE", endpoint, undefined, options);
  },

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> => {
    return apiFetch<T>("PATCH", endpoint, body, options);
  }
};

export { apiFetch };
export type { ApiResponse, ApiClientError, RequestOptions } from "./types/api";
