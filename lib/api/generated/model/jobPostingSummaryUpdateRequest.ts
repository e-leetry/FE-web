import type { JobPostingSummaryUpdateRequestPlatform } from './jobPostingSummaryUpdateRequestPlatform';

/**
 * 채용 공고 요약 수정 요청
 */
export interface JobPostingSummaryUpdateRequest {
  /** 공고 제목 */
  title: string;
  /** 회사명 */
  companyName: string;
  /** 공고 URL */
  url?: string;
  /** 공고 내용 JSON */
  contentJson?: string;
  /** 마감일 */
  deadline?: string;
  /** 수집 일시 */
  crawledAt?: string;
  /** 플랫폼 */
  platform: JobPostingSummaryUpdateRequestPlatform;
}
