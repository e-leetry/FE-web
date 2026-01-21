import type { JobPostingContent } from './jobPostingContent';
import type { JobPostingSummaryResponsePlatform } from './jobPostingSummaryResponsePlatform';

export interface JobPostingSummaryResponse {
  /** 채용 공고 요약 ID */
  id: number;
  /** 대시보드 ID */
  dashboardId: number;
  /** 공고 제목 */
  title: string;
  /** 회사명 */
  companyName: string;
  /** 공고 URL */
  url?: string;
  /** 공고 내용 */
  contentJson?: JobPostingContent;
  /** 마감일 */
  deadline?: string;
  /** 수집 일시 */
  crawledAt?: string;
  /** 플랫폼 */
  platform: JobPostingSummaryResponsePlatform;
  /** 정렬 순서 */
  sortOrder: number;
  /** 메모 */
  memo?: string;
}
