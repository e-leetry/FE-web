import type { ApiError } from './apiError';

export interface ApiResponseUnit {
  success: boolean;
  error?: ApiError;
}
