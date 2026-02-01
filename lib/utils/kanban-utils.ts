import { arrayMove } from "@dnd-kit/sortable";

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
export function reorderJobsInColumn(
  columns: Column[],
  columnId: number,
  activeJobId: number,
  overId: number
): Column[] {
  const column = columns.find((col) => col.id === columnId);
  if (!column) return columns;

  const columnJobs = [...column.jobs];
  const activeIndex = columnJobs.findIndex((job) => job.id === activeJobId);

  const overJobIndex = columnJobs.findIndex((job) => job.id === overId);
  const isColumnDrop = overId === columnId && activeJobId === overId;
  const targetIndex =
    isColumnDrop || (overJobIndex === -1 && overId === columnId)
      ? columnJobs.length - 1
      : overJobIndex;

  if (activeIndex === -1 || targetIndex === -1 || activeIndex === targetIndex) {
    return columns;
  }

  const newJobs = arrayMove(columnJobs, activeIndex, targetIndex);

  return columns.map((col) => (col.id === columnId ? { ...col, jobs: newJobs } : col));
}

/**
 * 다른 컬럼으로 Job을 이동합니다.
 */
export function moveJobBetweenColumns(
  columns: Column[],
  fromColumnId: number,
  toColumnId: number,
  activeJobId: number,
  overId: number
): Column[] {
  const fromColumn = columns.find((col) => col.id === fromColumnId);
  const toColumn = columns.find((col) => col.id === toColumnId);

  if (!fromColumn || !toColumn) return columns;

  const fromJobs = [...fromColumn.jobs];
  const toJobs = [...toColumn.jobs];

  const activeIndex = fromJobs.findIndex((job) => job.id === activeJobId);
  if (activeIndex === -1) return columns;

  const [removedJob] = fromJobs.splice(activeIndex, 1);

  const overJobIndex = toJobs.findIndex((job) => job.id === overId);
  const isColumnDrop = overId === toColumnId && overJobIndex === -1;
  const insertIndex = isColumnDrop || overJobIndex === -1 ? toJobs.length : overJobIndex;

  toJobs.splice(insertIndex, 0, removedJob);

  return columns.map((col) => {
    if (col.id === fromColumnId) return { ...col, jobs: fromJobs };
    if (col.id === toColumnId) return { ...col, jobs: toJobs };
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
