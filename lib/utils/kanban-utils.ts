export interface Job {
  id: number;
  companyName: string;
  type?: "default" | "loading" | "add";
  title?: string;
  deadline?: string;
  url?: string;
}

export interface Column {
  id: number;
  title: string;
  jobs: Job[];
}

/**
 * ID 또는 Job ID로 컬럼을 찾습니다.
 */
export function findColumnByIdOrJob(columns: Column[], id: number): Column | undefined {
  // Job ID로 컬럼 찾기 (ID가 컬럼 ID와 같아도 Job을 우선)
  const columnByJob = columns.find((col) => col.jobs.some((job) => job.id === id));
  if (columnByJob) return columnByJob;

  // 컬럼 ID로 직접 찾기
  return columns.find((col) => col.id === id);
}

/**
 * 같은 컬럼 내에서 Job 순서를 변경합니다.
 */
interface DropPositionOptions {
  insertAfter?: boolean;
  isColumnDrop?: boolean;
}

export function reorderJobsInColumn(
  columns: Column[],
  columnId: number,
  activeJobId: number,
  overId: number,
  options: DropPositionOptions = {}
): Column[] {
  const { insertAfter = false, isColumnDrop } = options;
  const column = columns.find((col) => col.id === columnId);
  if (!column) return columns;

  const droppingOnColumn = isColumnDrop ?? overId === columnId;

  if (!droppingOnColumn && activeJobId === overId) {
    return columns;
  }

  const activeJob = column.jobs.find((job) => job.id === activeJobId);
  if (!activeJob) return columns;

  const remainingJobs = column.jobs.filter((job) => job.id !== activeJobId);

  let insertIndex: number;
  if (droppingOnColumn) {
    insertIndex = remainingJobs.length;
  } else {
    const overIndex = remainingJobs.findIndex((job) => job.id === overId);
    if (overIndex === -1) {
      return columns;
    }
    insertIndex = insertAfter ? overIndex + 1 : overIndex;
  }

  const nextJobs = [...remainingJobs];
  const clampedIndex = Math.min(Math.max(insertIndex, 0), nextJobs.length);
  nextJobs.splice(clampedIndex, 0, activeJob);

  return columns.map((col) => (col.id === columnId ? { ...col, jobs: nextJobs } : col));
}

/**
 * 다른 컬럼으로 Job을 이동합니다.
 */
export function moveJobBetweenColumns(
  columns: Column[],
  fromColumnId: number,
  toColumnId: number,
  activeJobId: number,
  overId: number,
  options: DropPositionOptions = {}
): Column[] {
  const { insertAfter = false, isColumnDrop } = options;
  const fromColumn = columns.find((col) => col.id === fromColumnId);
  const toColumn = columns.find((col) => col.id === toColumnId);

  if (!fromColumn || !toColumn) return columns;

  const activeJob = fromColumn.jobs.find((job) => job.id === activeJobId);
  if (!activeJob) return columns;

  const fromJobs = fromColumn.jobs.filter((job) => job.id !== activeJobId);
  const toJobs = [...toColumn.jobs];

  const droppingOnColumn = isColumnDrop ?? overId === toColumnId;
  let insertIndex: number;

  if (droppingOnColumn || toJobs.length === 0) {
    insertIndex = toJobs.length;
  } else {
    const overIndex = toJobs.findIndex((job) => job.id === overId);
    if (overIndex === -1) {
      return columns;
    }
    insertIndex = insertAfter ? overIndex + 1 : overIndex;
  }

  const nextToJobs = [...toJobs];
  const clampedIndex = Math.min(Math.max(insertIndex, 0), nextToJobs.length);
  nextToJobs.splice(clampedIndex, 0, activeJob);

  return columns.map((col) => {
    if (col.id === fromColumnId) return { ...col, jobs: fromJobs };
    if (col.id === toColumnId) return { ...col, jobs: nextToJobs };
    return col;
  });
}

/**
 * 드롭 위치가 원래 위치와 같은지 확인합니다.
 */
export function isSameDropPosition(
  originalColumnId: number | null,
  targetColumnId: number,
  originalIndex: number | null,
  targetIndex: number
): boolean {
  return originalColumnId === targetColumnId && originalIndex === targetIndex;
}

/**
 * 컬럼에서 특정 Job의 인덱스를 찾습니다.
 */
export function findJobIndexInColumn(column: Column, jobId: number): number {
  return column.jobs.findIndex((job) => job.id === jobId);
}
