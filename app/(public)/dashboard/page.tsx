"use client";

import React, { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { StatusHeader } from "@/components/dashboard/status-header";
import { JobCard } from "@/components/dashboard/job-card";
import { CardDetailModal } from "@/components/common/card-detail-modal";
import { FloatingInputButton } from "@/components/features/dashboard/floating-input-button";
import { useAuth } from "@/lib/auth/useAuth";
import {
  useGetDashboards,
  getGetDashboardsQueryKey
} from "@/lib/api/generated/dashboard/dashboard";
import { useMove } from "@/lib/api/generated/job-posting-summary/job-posting-summary";
import { useQueryClient } from "@tanstack/react-query";
import { useJobSummarizeContext } from "@/lib/context/job-summarize-context";
import { useLocalDashboard, LocalJob } from "@/lib/hooks/use-local-dashboard";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

interface Job {
  id: number;
  companyName: string;
  type?: "default" | "loading" | "add";
  title?: string;
  deadline?: string;
}

interface Column {
  id: string;
  title: string;
  jobs: Job[];
}

const INITIAL_COLUMNS: Column[] = [
  { id: "interest", title: "관심공고", jobs: [] },
  { id: "applied", title: "서류제출", jobs: [] },
  { id: "interview1", title: "1차면접", jobs: [] },
  { id: "interview2", title: "2차면접", jobs: [] },
  { id: "final", title: "최종합격", jobs: [] }
];

function KanbanColumn({
  column,
  handleCardClick
}: {
  column: Column;
  handleCardClick: (job: Job, columnId: string) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: column.id
  });

  return (
    <div className="flex min-w-[180px] flex-1 flex-col gap-[16px]">
      <StatusHeader title={column.title} count={column.jobs.length} />
      <SortableContext
        id={column.id}
        items={column.jobs.map((job) => job.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex min-h-[200px] flex-1 flex-col gap-[16px]">
          {column.jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              type={job.type || "default"}
              companyName={job.companyName}
              title={job.title}
              deadline={job.deadline}
              onClick={() => handleCardClick(job, column.id)}
            />
          ))}
          <JobCard
            type="add"
            onClick={() => handleCardClick({ id: -Date.now(), companyName: "" }, column.id)}
          />
        </div>
      </SortableContext>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  const { streamingData, startSummarize, reset: resetSse } = useJobSummarizeContext();

  // 로컬스토리지 훅 (비로그인 사용자용)
  const {
    columns: localStorageColumns,
    isLoaded: isLocalLoaded,
    addLoadingJob,
    updateJob: updateLocalJob,
    moveJob: moveLocalJob,
    reorderJobs: reorderLocalJobs,
    findJob: findLocalJob
  } = useLocalDashboard();

  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isInputLoading, setIsInputLoading] = useState(false);

  // 온보딩에서 넘어온 URL 처리 여부 추적
  const jobUrlProcessedRef = useRef(false);

  const { data: dashboardsData } = useGetDashboards({
    query: {
      enabled: isLoggedIn
    }
  });

  const moveMutation = useMove({
    mutation: {
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: getGetDashboardsQueryKey() });
        const previousData = queryClient.getQueryData(getGetDashboardsQueryKey());
        return { previousData };
      },
      onError: (error, _variables, context) => {
        console.error("Move mutation failed:", error);
        if (context?.previousData) {
          queryClient.setQueryData(getGetDashboardsQueryKey(), context.previousData);
        }
      }
    }
  });

  // 컬럼 데이터 결정 (로그인 여부에 따라)
  const columns = useMemo<Column[]>(() => {
    // 로그인 사용자: 서버 데이터 사용
    if (isLoggedIn && dashboardsData && dashboardsData.length > 0) {
      return dashboardsData.map((dashboard) => ({
        id: dashboard.id.toString(),
        title: dashboard.label,
        jobs: (dashboard.jobPostings || []).map((jp) => ({
          id: jp.id,
          companyName: jp.companyName,
          title: jp.title,
          deadline: jp.deadline,
          type: "default" as const
        }))
      }));
    }

    // 비로그인 사용자: 로컬스토리지 데이터 사용
    if (!isLoggedIn && isLocalLoaded) {
      return localStorageColumns.map((col) => ({
        id: col.id,
        title: col.title,
        jobs: col.jobs.map((job) => ({
          id: job.id,
          companyName: job.companyName,
          title: job.title,
          deadline: job.deadline,
          type: job.type || ("default" as const)
        }))
      }));
    }

    return INITIAL_COLUMNS;
  }, [isLoggedIn, dashboardsData, isLocalLoaded, localStorageColumns]);

  const [localColumns, setLocalColumns] = useState<Column[] | null>(null);
  const [prevColumns, setPrevColumns] = useState<Column[]>(columns);

  if (columns !== prevColumns) {
    setLocalColumns(null);
    setPrevColumns(columns);
  }

  const displayColumns = localColumns || columns;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | undefined>(undefined);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [originalColumnId, setOriginalColumnId] = useState<string | null>(null);
  const [originalIndex, setOriginalIndex] = useState<number | null>(null);

  const [mounted, setMounted] = useState(false);
  const [sseJobId, setSseJobId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 온보딩에서 넘어온 URL 처리
  useEffect(() => {
    if (!mounted || jobUrlProcessedRef.current) return;

    const jobUrl = searchParams.get("jobUrl");
    if (jobUrl) {
      jobUrlProcessedRef.current = true;

      // URL 쿼리 파라미터 제거
      router.replace("/dashboard", { scroll: false });

      // SSE 시작
      startTransition(() => {
        setIsInputLoading(true);
      });
      startSummarize(decodeURIComponent(jobUrl));
    }
  }, [mounted, searchParams, router, startSummarize]);

  // SSE 메타데이터 도착 시 처리
  useEffect(() => {
    if (streamingData.metadata && isInputLoading) {
      startTransition(() => {
        setIsInputLoading(false);
        setIsInputOpen(false);

        const jobId = streamingData.metadata!.jobId;
        setSseJobId(jobId);

        // 첫 번째 컬럼 ID (관심공고)
        const firstColumnId = displayColumns[0]?.id || "interest";
        setSelectedColumnId(firstColumnId);

        // 비로그인 사용자: 로컬스토리지에 로딩 상태 Job 추가
        if (!isLoggedIn) {
          addLoadingJob(
            {
              id: jobId,
              companyName: streamingData.metadata!.companyName,
              title: streamingData.metadata!.title,
              deadline: streamingData.metadata!.deadline || undefined
            },
            firstColumnId
          );
        }

        // SSE용 임시 job 데이터 설정
        setSelectedJob({
          id: jobId,
          companyName: streamingData.metadata!.companyName,
          title: streamingData.metadata!.title,
          deadline: streamingData.metadata!.deadline || undefined,
          type: "loading"
        });

        // 모달 열기
        setIsModalOpen(true);
      });
    }
  }, [streamingData.metadata, isInputLoading, displayColumns, isLoggedIn, addLoadingJob]);

  // SSE 완료 시 처리
  useEffect(() => {
    if (streamingData.isComplete && sseJobId) {
      if (isLoggedIn) {
        // 로그인 사용자: 서버 데이터 새로고침
        queryClient.invalidateQueries({ queryKey: getGetDashboardsQueryKey() });
      } else {
        // 비로그인 사용자: 로컬스토리지 업데이트 (로딩 -> 완료)
        updateLocalJob(sseJobId, {
          hireProcess: streamingData.hireProcess,
          mainTasks: streamingData.mainTasks,
          requirements: streamingData.requirements,
          preferred: streamingData.preferred
        });
      }

      startTransition(() => {
        setSseJobId(null);
      });
    }
  }, [
    streamingData.isComplete,
    streamingData.hireProcess,
    streamingData.mainTasks,
    streamingData.requirements,
    streamingData.preferred,
    sseJobId,
    isLoggedIn,
    queryClient,
    updateLocalJob
  ]);

  // SSE 에러 처리
  useEffect(() => {
    if (streamingData.error) {
      startTransition(() => {
        setIsInputLoading(false);
      });
      console.error("SSE Error:", streamingData.error);
    }
  }, [streamingData.error]);

  const handleSseSubmit = useCallback(
    (url: string) => {
      setIsInputLoading(true);
      startSummarize(url);
    },
    [startSummarize]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const findColumn = (id: number | string) => {
    if (displayColumns.some((col) => col.id === id)) {
      return displayColumns.find((col) => col.id === id);
    }
    return displayColumns.find((col) => col.jobs.some((job) => job.id === id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as number;
    setActiveId(activeId);

    const activeColumn = findColumn(activeId);
    if (activeColumn) {
      setOriginalColumnId(activeColumn.id);
      setOriginalIndex(activeColumn.jobs.findIndex((job) => job.id === activeId));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number | string;

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn) {
      return;
    }

    // 같은 컬럼 내에서 순서 변경
    if (activeColumn === overColumn) {
      setLocalColumns((prev) => {
        const currentColumns = prev || columns;
        const columnJobs = [...activeColumn.jobs];

        const activeIndex = columnJobs.findIndex((job) => job.id === activeId);
        const overIndex =
          overColumn.id === overId
            ? columnJobs.length - 1
            : columnJobs.findIndex((job) => job.id === overId);

        if (activeIndex === overIndex) return prev;

        const newJobs = arrayMove(columnJobs, activeIndex, overIndex);

        return currentColumns.map((col) => {
          if (col.id === activeColumn.id) {
            return { ...col, jobs: newJobs };
          }
          return col;
        });
      });
      return;
    }

    // 다른 컬럼으로 이동
    setLocalColumns((prev) => {
      const currentColumns = prev || columns;
      const activeJobs = [...activeColumn.jobs];
      const overJobs = [...overColumn.jobs];

      const activeIndex = activeJobs.findIndex((job) => job.id === activeId);
      const overIndex =
        overColumn.id === overId ? overJobs.length : overJobs.findIndex((job) => job.id === overId);

      const [removedJob] = activeJobs.splice(activeIndex, 1);
      overJobs.splice(overIndex, 0, removedJob);

      return currentColumns.map((col) => {
        if (col.id === activeColumn.id) {
          return { ...col, jobs: activeJobs };
        }
        if (col.id === overColumn.id) {
          return { ...col, jobs: overJobs };
        }
        return col;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setOriginalColumnId(null);
      setOriginalIndex(null);
      return;
    }

    const activeId = active.id as number;
    const overId = over.id as number | string;

    const currentColumns = localColumns || columns;

    const findColumnInCurrent = (id: number | string) => {
      if (currentColumns.some((col) => col.id === id)) {
        return currentColumns.find((col) => col.id === id);
      }
      return currentColumns.find((col) => col.jobs.some((job) => job.id === id));
    };

    const overColumn = findColumnInCurrent(overId);

    if (!overColumn) {
      setActiveId(null);
      setOriginalColumnId(null);
      setOriginalIndex(null);
      return;
    }

    const currentCardIndex = overColumn.jobs.findIndex((job) => job.id === activeId);
    const isSamePosition = originalColumnId === overColumn.id && originalIndex === currentCardIndex;

    if (isSamePosition || currentCardIndex === -1) {
      setActiveId(null);
      setOriginalColumnId(null);
      setOriginalIndex(null);
      return;
    }

    if (isLoggedIn) {
      // 로그인 사용자: 서버 API 호출
      const prevItemId =
        currentCardIndex > 0 ? overColumn.jobs[currentCardIndex - 1]?.id : undefined;
      const nextItemId =
        currentCardIndex < overColumn.jobs.length - 1
          ? overColumn.jobs[currentCardIndex + 1]?.id
          : undefined;

      queryClient.setQueryData(getGetDashboardsQueryKey(), () => {
        return currentColumns.map((col) => ({
          id: Number(col.id),
          label: col.title,
          jobPostings: col.jobs.map((job) => ({
            id: job.id,
            companyName: job.companyName,
            title: job.title,
            deadline: job.deadline
          }))
        }));
      });

      setLocalColumns(null);

      moveMutation.mutate({
        summaryId: activeId,
        data: {
          dashboardId: Number(overColumn.id),
          prevItemId,
          nextItemId
        }
      });
    } else {
      // 비로그인 사용자: 로컬스토리지 업데이트
      if (originalColumnId === overColumn.id) {
        // 같은 컬럼 내 순서 변경
        reorderLocalJobs(overColumn.id, originalIndex!, currentCardIndex);
      } else {
        // 다른 컬럼으로 이동
        moveLocalJob(activeId, overColumn.id, currentCardIndex);
      }
      setLocalColumns(null);
    }

    setActiveId(null);
    setOriginalColumnId(null);
    setOriginalIndex(null);
  };

  const handleCardClick = (job: Job, columnId: string) => {
    setSelectedJob(job);
    setSelectedColumnId(columnId);
    setIsModalOpen(true);
  };

  // 모달에서 저장 시 호출 (비로그인 사용자용)
  const handleSaveToLocal = useCallback(
    (jobData: LocalJob) => {
      updateLocalJob(jobData.id, jobData);
    },
    [updateLocalJob]
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setSelectedColumnId(undefined);
    setSseJobId(null);
    resetSse();
  };

  const activeJob = activeId
    ? displayColumns.flatMap((col) => col.jobs).find((job) => job.id === activeId)
    : null;

  const initialModalData = useMemo(() => {
    if (!selectedJob || selectedJob.id < 0) return null;

    if (isLoggedIn) {
      // 로그인 사용자: 서버 데이터에서 찾기
      const allJobs = dashboardsData?.flatMap((d) => d.jobPostings || []) || [];
      return allJobs.find((jp) => jp.id === selectedJob.id);
    } else {
      // 비로그인 사용자: 로컬스토리지에서 찾기
      return findLocalJob(selectedJob.id);
    }
  }, [selectedJob, dashboardsData, isLoggedIn, findLocalJob]);

  if (!mounted) {
    return (
      <div className="flex w-full flex-1 flex-col overflow-x-auto bg-[#F6F7F9]">
        <div className="flex min-w-fit flex-1 gap-[20px] px-[80px] py-8 min-[1920px]:gap-[32px] min-[1920px]:px-[240px]">
          {displayColumns.flatMap((column, index) => [
            <div key={column.id} className="flex min-w-[180px] flex-1 flex-col gap-[16px]">
              <StatusHeader title={column.title} count={column.jobs.length} />
              <div className="flex min-h-[200px] flex-1 flex-col gap-[16px]">
                {column.jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    type={job.type || "default"}
                    companyName={job.companyName}
                    title={job.title}
                    deadline={job.deadline}
                    onClick={() => handleCardClick(job, column.id)}
                  />
                ))}
                <JobCard
                  type="add"
                  onClick={() => handleCardClick({ id: -Date.now(), companyName: "" }, column.id)}
                />
              </div>
            </div>,
            ...(index < displayColumns.length - 1
              ? [
                  <div
                    key={`sep-${index}`}
                    className="w-[1px] flex-shrink-0 self-stretch bg-[#E9E9E9]"
                  />
                ]
              : [])
          ])}
        </div>
        <FloatingInputButton
          isOpen={isInputOpen}
          onOpenChange={setIsInputOpen}
          isLoading={isInputLoading}
          onSubmit={handleSseSubmit}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 flex-col overflow-x-auto bg-[#F6F7F9]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex min-w-fit flex-1 gap-[20px] px-[80px] py-8 min-[1920px]:gap-[32px] min-[1920px]:px-[240px]">
          {displayColumns.flatMap((column, index) => [
            <KanbanColumn key={column.id} column={column} handleCardClick={handleCardClick} />,
            ...(index < displayColumns.length - 1
              ? [
                  <div
                    key={`sep-${index}`}
                    className="w-[1px] flex-shrink-0 self-stretch bg-[#E9E9E9]"
                  />
                ]
              : [])
          ])}
        </div>

        <DragOverlay>
          {activeJob ? (
            <JobCard
              id={activeJob.id}
              type={activeJob.type || "default"}
              companyName={activeJob.companyName}
              title={activeJob.title}
              deadline={activeJob.deadline}
              className="rotate-3 scale-105 shadow-xl transition-transform"
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CardDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        dashboardId={selectedColumnId ? Number(selectedColumnId) : undefined}
        jobPostingId={selectedJob?.id && selectedJob.id > 0 ? selectedJob.id : undefined}
        initialData={initialModalData}
        sseData={streamingData.metadata ? streamingData : undefined}
        isLoggedIn={isLoggedIn}
        onSaveToLocal={handleSaveToLocal}
      />
      <FloatingInputButton
        isOpen={isInputOpen}
        onOpenChange={setIsInputOpen}
        isLoading={isInputLoading}
        onSubmit={handleSseSubmit}
      />
    </div>
  );
}
