"use client";

import { useState, useCallback, useEffect, startTransition } from "react";

const LOCAL_STORAGE_KEY = "reet_dashboard_data";

export interface LocalJob {
  id: number;
  companyName: string;
  title?: string;
  deadline?: string;
  type?: "default" | "loading";
  // SSE에서 받아온 상세 데이터
  hireProcess?: string;
  mainTasks?: string;
  requirements?: string;
  preferred?: string;
}

export interface LocalColumn {
  id: string;
  title: string;
  jobs: LocalJob[];
}

const INITIAL_LOCAL_COLUMNS: LocalColumn[] = [
  { id: "interest", title: "관심공고", jobs: [] },
  { id: "applied", title: "서류제출", jobs: [] },
  { id: "interview1", title: "1차면접", jobs: [] },
  { id: "interview2", title: "2차면접", jobs: [] },
  { id: "final", title: "최종합격", jobs: [] }
];

export function useLocalDashboard() {
  const [columns, setColumns] = useState<LocalColumn[]>(INITIAL_LOCAL_COLUMNS);
  const [isLoaded, setIsLoaded] = useState(false);

  // 로컬스토리지에서 데이터 로드
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as LocalColumn[];
        startTransition(() => {
          setColumns(parsed);
        });
      }
    } catch (error) {
      console.error("Failed to load dashboard from localStorage:", error);
    }
    startTransition(() => {
      setIsLoaded(true);
    });
  }, []);

  // 로컬스토리지에 저장
  const saveToStorage = useCallback((data: LocalColumn[]) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save dashboard to localStorage:", error);
    }
  }, []);

  // Job 추가 (로딩 상태로)
  const addLoadingJob = useCallback(
    (job: Omit<LocalJob, "type">, columnId: string = "interest") => {
      setColumns((prev) => {
        const newColumns = prev.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              jobs: [...col.jobs, { ...job, type: "loading" as const }]
            };
          }
          return col;
        });
        saveToStorage(newColumns);
        return newColumns;
      });
    },
    [saveToStorage]
  );

  // Job 업데이트 (로딩 완료 후 데이터 채우기)
  const updateJob = useCallback(
    (jobId: number, updates: Partial<LocalJob>) => {
      setColumns((prev) => {
        const newColumns = prev.map((col) => ({
          ...col,
          jobs: col.jobs.map((job) =>
            job.id === jobId ? { ...job, ...updates, type: "default" as const } : job
          )
        }));
        saveToStorage(newColumns);
        return newColumns;
      });
    },
    [saveToStorage]
  );

  // Job 삭제
  const removeJob = useCallback(
    (jobId: number) => {
      setColumns((prev) => {
        const newColumns = prev.map((col) => ({
          ...col,
          jobs: col.jobs.filter((job) => job.id !== jobId)
        }));
        saveToStorage(newColumns);
        return newColumns;
      });
    },
    [saveToStorage]
  );

  // Job 이동 (컬럼 간)
  const moveJob = useCallback(
    (jobId: number, toColumnId: string, toIndex?: number) => {
      setColumns((prev) => {
        let movedJob: LocalJob | null = null;

        // 기존 위치에서 제거
        const withoutJob = prev.map((col) => {
          const jobIndex = col.jobs.findIndex((j) => j.id === jobId);
          if (jobIndex !== -1) {
            movedJob = col.jobs[jobIndex];
            return {
              ...col,
              jobs: col.jobs.filter((j) => j.id !== jobId)
            };
          }
          return col;
        });

        if (!movedJob) return prev;

        // 새 위치에 추가
        const newColumns = withoutJob.map((col) => {
          if (col.id === toColumnId) {
            const jobs = [...col.jobs];
            if (toIndex !== undefined) {
              jobs.splice(toIndex, 0, movedJob!);
            } else {
              jobs.push(movedJob!);
            }
            return { ...col, jobs };
          }
          return col;
        });

        saveToStorage(newColumns);
        return newColumns;
      });
    },
    [saveToStorage]
  );

  // 컬럼 내 순서 변경
  const reorderJobs = useCallback(
    (columnId: string, fromIndex: number, toIndex: number) => {
      setColumns((prev) => {
        const newColumns = prev.map((col) => {
          if (col.id === columnId) {
            const jobs = [...col.jobs];
            const [removed] = jobs.splice(fromIndex, 1);
            jobs.splice(toIndex, 0, removed);
            return { ...col, jobs };
          }
          return col;
        });
        saveToStorage(newColumns);
        return newColumns;
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
    setColumns(INITIAL_LOCAL_COLUMNS);
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
