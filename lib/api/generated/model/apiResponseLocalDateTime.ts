import type { ApiError } from './apiError';

export interface ApiResponseLocalDateTime {
  success: boolean;
  data?: string;
  error?: ApiError;
}
