import type { ApiError } from './apiError';

export interface ApiResponseString {
  success: boolean;
  data?: string;
  error?: ApiError;
}
