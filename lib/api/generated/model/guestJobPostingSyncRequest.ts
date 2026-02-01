
/**
 * 게스트 채용 공고 동기화 요청
 */
export interface GuestJobPostingSyncRequest {
  /** 회사명 */
  companyName: string;
  /** 공고 제목 */
  title: string;
  /** 마감일 */
  deadline?: string;
  /** 채용 공고 원본 URL */
  url?: string;
  /** 채용 프로세스 */
  hireProcess?: string;
  /** 주요 업무 */
  mainTasks?: string;
  /** 자격 요건 */
  requirements?: string;
  /** 우대 사항 */
  preferred?: string;
  /** 메모 */
  memo?: string;
}
