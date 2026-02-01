
/**
 * 채용 공고 요약 제목/회사명 수정 요청
 */
export interface JobPostingSummaryRenameRequest {
  /** 공고 제목 */
  title: string;
  /** 회사명 */
  companyName: string;
}
