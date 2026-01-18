import type { ApiError } from './apiError';
import type { UserResponse } from './userResponse';

export interface ApiResponseListUserResponse {
  success: boolean;
  data?: UserResponse[];
  error?: ApiError;
}
