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
  id: string;
  title: string;
  jobs: Job[];
}

/**
 * ID 또는 Job ID로 컬럼을 찾습니다.
 */
export function findColumnByIdOrJob(
  columns: Column[],
  id: number | string
): Column | undefined {
  // 컬럼 ID로 직접 찾기
  const columnById = columns.find((col) => col.id === id);
  if (columnById) return columnById;

  // Job ID로 컬럼 찾기
  return columns.find((col) => col.jobs.some((job) => job.id === id));
}

/**
 * 같은 컬럼 내에서 Job 순서를 변경합니다.
 */
export function reorderJobsInColumn(
  columns: Column[],
  columnId: string,
  activeJobId: number,
  overId: number | string
): Column[] {
  const column = columns.find((col) => col.id === columnId);
  if (!column) return columns;

  const columnJobs = [...column.jobs];
  const activeIndex = columnJobs.findIndex((job) => job.id === activeJobId);

  // overId가 컬럼 ID면 맨 끝으로, 아니면 해당 Job 위치로
  const overIndex =
    columnId === overId
      ? columnJobs.length - 1
      : columnJobs.findIndex((job) => job.id === overId);

  if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
    return columns;
  }

  const newJobs = arrayMove(columnJobs, activeIndex, overIndex);

  return columns.map((col) =>
    col.id === columnId ? { ...col, jobs: newJobs } : col
  );
}

/**
 * 다른 컬럼으로 Job을 이동합니다.
 */
export function moveJobBetweenColumns(
  columns: Column[],
  fromColumnId: string,
  toColumnId: string,
  activeJobId: number,
  overId: number | string
): Column[] {
  const fromColumn = columns.find((col) => col.id === fromColumnId);
  const toColumn = columns.find((col) => col.id === toColumnId);

  if (!fromColumn || !toColumn) return columns;

  const fromJobs = [...fromColumn.jobs];
  const toJobs = [...toColumn.jobs];

  const activeIndex = fromJobs.findIndex((job) => job.id === activeJobId);
  if (activeIndex === -1) return columns;

  // overId가 컬럼 ID면 맨 끝으로, 아니면 해당 Job 위치로
  const overIndex =
    toColumnId === overId
      ? toJobs.length
      : toJobs.findIndex((job) => job.id === overId);

  const [removedJob] = fromJobs.splice(activeIndex, 1);
  toJobs.splice(overIndex === -1 ? toJobs.length : overIndex, 0, removedJob);

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
  originalColumnId: string | null,
  targetColumnId: string,
  originalIndex: number | null,
  targetIndex: number
): boolean {
  return originalColumnId === targetColumnId && originalIndex === targetIndex;
}

/**
 * 컬럼에서 특정 Job의 인덱스를 찾습니다.
 */
export function findJobIndexInColumn(
  column: Column,
  jobId: number
): number {
  return column.jobs.findIndex((job) => job.id === jobId);
}

