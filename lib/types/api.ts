// 서버 응답 형식
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
}

// 커스텀 에러 클래스
export class ApiClientError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

// 응답 파싱 타입
export type ParseAs = "json" | "text";

// 요청 옵션 타입
export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  parseAs?: ParseAs;
  signal?: AbortSignal;
}
