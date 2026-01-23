import type { ApiError } from './apiError';
import type { UserResponse } from './userResponse';

export interface ApiResponseUserResponse {
  success: boolean;
  data?: UserResponse;
  error?: ApiError;
}
