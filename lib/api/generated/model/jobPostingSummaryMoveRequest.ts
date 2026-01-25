
/**
 * 채용 공고 요약 이동 요청
 */
export interface JobPostingSummaryMoveRequest {
  /** 이동할 대시보드 ID */
  dashboardId: number;
  /** 이동할 위치의 이전 아이템 ID (맨 앞에 이동 시 null) */
  prevItemId?: number;
  /** 이동할 위치의 다음 아이템 ID (맨 뒤에 이동 시 null) */
  nextItemId?: number;
}
