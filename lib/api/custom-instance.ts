import { apiFetch, RequestOptions } from '../api-client';

export const customInstance = <T>(
  config: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    params?: any;
    data?: any;
    headers?: any;
    signal?: AbortSignal;
  },
  options?: RequestOptions,
): Promise<T> => {
  const { url, method, params, data, headers, signal } = config;

  // URL에 쿼리 파라미터 추가
  const fullUrl = params ? buildUrlWithParams(url, params) : url;

  return apiFetch<T>(method, fullUrl, data, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
    signal,
  });
};

function buildUrlWithParams(url: string, params: any) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
}

export type ErrorType<Error> = Error;

export type BodyType<Body> = Body;
