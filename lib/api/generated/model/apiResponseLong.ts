import type { ApiError } from './apiError';

export interface ApiResponseLong {
  success: boolean;
  data?: number;
  error?: ApiError;
}
