import type { JobPostingSummaryResponse } from './jobPostingSummaryResponse';

/**
 * 대시보드 응답 데이터
 */
export interface DashboardResponse {
  /** 대시보드 식별자 */
  id: number;
  /** 대시보드 이름 */
  label: string;
  /** 정렬 순서 */
  sortOrder: number;
  /** 채용 공고 요약 목록 */
  jobPostings: JobPostingSummaryResponse[];
}
