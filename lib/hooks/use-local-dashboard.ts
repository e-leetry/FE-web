"use client";

import { useState, useCallback, useEffect, startTransition } from "react";

const LOCAL_STORAGE_KEY = "reet_dashboard_data";

interface StoredJob extends LocalJob {
  columnId: number;
}

export interface LocalJob {
  id: number;
  companyName: string;
  title?: string;
  deadline?: string;
  /** 채용공고 원본 URL */
  url?: string;
  type?: "default" | "loading";
  // SSE에서 받아온 상세 데이터
  hireProcess?: string;
  mainTasks?: string;
  requirements?: string;
  preferred?: string;
}

export interface LocalColumn {
  id: number;
  title: string;
  jobs: LocalJob[];
}

export const INITIAL_LOCAL_COLUMNS: LocalColumn[] = [
  { id: 1, title: "관심공고", jobs: [] },
  { id: 2, title: "서류제출", jobs: [] },
  { id: 3, title: "1차면접", jobs: [] },
  { id: 4, title: "2차면접", jobs: [] },
  { id: 5, title: "최종합격", jobs: [] }
];

const buildColumnsWithSingle = (storedJob: StoredJob | null): LocalColumn[] =>
  INITIAL_LOCAL_COLUMNS.map((col) => ({
    ...col,
    jobs:
      storedJob && storedJob.columnId === col.id
        ? [
            {
              id: storedJob.id,
              companyName: storedJob.companyName,
              title: storedJob.title,
              deadline: storedJob.deadline,
              url: storedJob.url,
              type: storedJob.type,
              hireProcess: storedJob.hireProcess,
              mainTasks: storedJob.mainTasks,
              requirements: storedJob.requirements,
              preferred: storedJob.preferred
            }
          ]
        : []
  }));

const extractStoredJob = (data: LocalColumn[]): StoredJob | null => {
  for (const col of data) {
    const job = col.jobs[0];
    if (job) {
      return { ...job, columnId: col.id } as StoredJob;
    }
  }
  return null;
};

export function useLocalDashboard() {
  const [columns, setColumns] = useState<LocalColumn[]>(() => buildColumnsWithSingle(null));
  const [isLoaded, setIsLoaded] = useState(false);

  // 로컬스토리지에 저장
  const saveToStorage = useCallback((job: StoredJob | null) => {
    if (typeof window === "undefined") return;

    try {
      if (!job) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return;
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(job));
    } catch (error) {
      console.error("Failed to save dashboard to localStorage:", error);
    }
  }, []);

  // 로컬스토리지에서 데이터 로드
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        let storedJob: StoredJob | null = null;

        if (parsed && typeof parsed === "object" && "columnId" in parsed) {
          storedJob = parsed as StoredJob;
        } else if (Array.isArray(parsed) && parsed[0] && typeof parsed[0] === "object") {
          const first = parsed[0];
          if (first && "columnId" in first) {
            storedJob = first as StoredJob;
          }
        }

        if (storedJob) {
          const nextColumns = buildColumnsWithSingle(storedJob);
          startTransition(() => {
            setColumns(nextColumns);
          });
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard from localStorage:", error);
    }
    startTransition(() => {
      setIsLoaded(true);
    });
  }, []);

  // Job 추가 (로딩 상태로)
  const addLoadingJob = useCallback(
    (job: Omit<LocalJob, "type">, columnId: number = 1) => {
      setColumns(() => {
        const storedJob: StoredJob = { ...job, columnId, type: "loading" };
        const nextColumns = buildColumnsWithSingle(storedJob);
        saveToStorage(storedJob);
        return nextColumns;
      });
    },
    [saveToStorage]
  );

  // Job 업데이트 (로딩 완료 후 데이터 채우기)
  const updateJob = useCallback(
    (jobId: number, updates: Partial<LocalJob>) => {
      setColumns((prev) => {
        const current = extractStoredJob(prev);
        if (!current || current.id !== jobId) return prev;

        const updated: StoredJob = {
          ...current,
          ...updates,
          type: "default" as const,
          columnId: current.columnId
        };

        const nextColumns = buildColumnsWithSingle(updated);
        saveToStorage(updated);
        console.log("updated", updated);
        return nextColumns;
      });
    },
    [saveToStorage]
  );

  // Job 삭제
  const removeJob = useCallback(
    (jobId: number) => {
      setColumns((prev) => {
        const current = extractStoredJob(prev);
        if (!current || current.id !== jobId) return prev;

        const nextColumns = buildColumnsWithSingle(null);
        saveToStorage(null);
        return nextColumns;
      });
    },
    [saveToStorage]
  );

  // Job 이동 (컬럼 간)
  const moveJob = useCallback(
    (jobId: number, toColumnId: number, _toIndex?: number) => {
      setColumns((prev) => {
        const current = extractStoredJob(prev);
        if (!current || current.id !== jobId) return prev;

        const moved: StoredJob = { ...current, columnId: toColumnId };
        const nextColumns = buildColumnsWithSingle(moved);
        saveToStorage(moved);
        return nextColumns;
      });
    },
    [saveToStorage]
  );

  // 컬럼 내 순서 변경
  const reorderJobs = useCallback(
    (_columnId: number, _fromIndex: number, _toIndex: number) => {
      setColumns((prev) => {
        const current = extractStoredJob(prev);
        if (!current) return prev;

        const nextColumns = buildColumnsWithSingle(current);
        saveToStorage(current);
        return nextColumns;
      });
    },
    [saveToStorage]
  );

  // Job 찾기
  const findJob = useCallback(
    (jobId: number): LocalJob | null => {
      for (const col of columns) {
        const job = col.jobs.find((j) => j.id === jobId);
        if (job) return job;
      }
      return null;
    },
    [columns]
  );

  // 전체 초기화
  const clearAll = useCallback(() => {
    setColumns(buildColumnsWithSingle(null));
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  return {
    columns,
    isLoaded,
    addLoadingJob,
    updateJob,
    removeJob,
    moveJob,
    reorderJobs,
    findJob,
    clearAll
  };
}
