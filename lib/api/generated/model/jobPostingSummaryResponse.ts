
/**
 * 채용 공고 요약 응답 데이터
 */
export interface JobPostingSummaryResponse {
  /** 기업명 */
  companyName: string;
  /** 직무명 */
  title: string;
  /** 마감일 */
  deadline?: string;
  /** 정렬 순서 */
  sortOrder: number;
  /** 메모 */
  memo?: string;
}
