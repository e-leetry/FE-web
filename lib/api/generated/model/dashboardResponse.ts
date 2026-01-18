
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
}
