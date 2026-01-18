import type { JobSummaryResponseStatus } from './jobSummaryResponseStatus';

export interface JobSummaryResponse {
  jobId: number;
  title: string;
  companyName: string;
  deadline?: string;
  status: JobSummaryResponseStatus;
}
