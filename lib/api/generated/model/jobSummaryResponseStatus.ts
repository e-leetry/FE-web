
export type JobSummaryResponseStatus = typeof JobSummaryResponseStatus[keyof typeof JobSummaryResponseStatus];


export const JobSummaryResponseStatus = {
  INITIALIZED: 'INITIALIZED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;
