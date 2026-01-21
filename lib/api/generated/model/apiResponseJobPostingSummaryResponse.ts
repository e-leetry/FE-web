import type { ApiError } from './apiError';
import type { JobPostingSummaryResponse } from './jobPostingSummaryResponse';

export interface ApiResponseJobPostingSummaryResponse {
  success: boolean;
  data?: JobPostingSummaryResponse;
  error?: ApiError;
}
