import type { ApiError } from './apiError';
import type { DashboardResponse } from './dashboardResponse';

export interface ApiResponseListDashboardResponse {
  success: boolean;
  data?: DashboardResponse[];
  error?: ApiError;
}
