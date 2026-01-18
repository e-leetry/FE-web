import type { ApiError } from './apiError';
import type { JobSummaryResponse } from './jobSummaryResponse';

export interface ApiResponseJobSummaryResponse {
  success: boolean;
  data?: JobSummaryResponse;
  error?: ApiError;
}
