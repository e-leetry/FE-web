"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  type?: "white" | "loading" | "add";
  title?: string;
  deadline?: string;
}

interface Column {
  id: string;
  title: string;
  jobs: Job[];
}

const INITIAL_COLUMNS: Column[] = [
  {
    id: "interest",
    title: "관심공고",
    jobs: []
  },
  {
    id: "applied",
    title: "서류제출",
    jobs: []
  },
  {
    id: "interview1",
    title: "1차면접",
    jobs: []
  },
  {
    id: "interview2",
    title: "2차면접",
    jobs: []
  },
  {
    id: "final",
    title: "최종합격",
    jobs: []
  }
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
        <div ref={setNodeRef} className="flex flex-1 flex-col gap-[16px] min-h-[200px]">
          {column.jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              type={job.type || "white"}
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
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  const { streamingData, startSummarize, reset: resetSse } = useJobSummarizeContext();
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isInputLoading, setIsInputLoading] = useState(false);

  const { data: dashboardsData } = useGetDashboards({
    query: {
      enabled: isLoggedIn
    }
  });

  const moveMutation = useMove({
    mutation: {
      onMutate: async () => {
        // 진행 중인 refetch 취소
        await queryClient.cancelQueries({ queryKey: getGetDashboardsQueryKey() });

        // 현재 캐시 데이터 스냅샷 저장 (롤백용)
        const previousData = queryClient.getQueryData(getGetDashboardsQueryKey());

        return { previousData };
      },
      onError: (error, _variables, context) => {
        console.error("Move mutation failed:", error);
        // 에러 시 이전 데이터로 롤백
        if (context?.previousData) {
          queryClient.setQueryData(getGetDashboardsQueryKey(), context.previousData);
        }
      }
    }
  });

  const columns = useMemo<Column[]>(() => {
    if (isLoggedIn && dashboardsData && dashboardsData.length > 0) {
      return dashboardsData.map((dashboard) => ({
        id: dashboard.id.toString(),
        title: dashboard.label,
        jobs: (dashboard.jobPostings || []).map((jp) => ({
          id: jp.id,
          companyName: jp.companyName,
          title: jp.title,
          deadline: jp.deadline,
          type: "white" as const
        }))
      }));
    }

    return INITIAL_COLUMNS;
  }, [isLoggedIn, dashboardsData]);

  const [localColumns, setLocalColumns] = useState<Column[] | null>(null);
  const [prevColumns, setPrevColumns] = useState<Column[]>(columns);

  if (columns !== prevColumns) {
    setLocalColumns(null);
    setPrevColumns(columns);
  }

  const displayColumns = localColumns || columns;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedDashboardId, setSelectedDashboardId] = useState<number | undefined>(undefined);
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

  // SSE 메타데이터 도착 시 처리
  useEffect(() => {
    if (streamingData.metadata && isInputLoading) {
      setIsInputLoading(false);
      setIsInputOpen(false);

      // 메타데이터에서 jobId 저장
      setSseJobId(streamingData.metadata.jobId);

      // 첫 번째 대시보드 ID (관심공고) 설정
      const firstDashboardId = displayColumns[0]?.id ? Number(displayColumns[0].id) : undefined;
      setSelectedDashboardId(firstDashboardId);

      // SSE용 임시 job 데이터 설정
      setSelectedJob({
        id: streamingData.metadata.jobId,
        companyName: streamingData.metadata.companyName,
        title: streamingData.metadata.title,
        deadline: streamingData.metadata.deadline || undefined,
        type: "loading"
      });

      // 모달 열기
      setIsModalOpen(true);
    }
  }, [streamingData.metadata, isInputLoading, displayColumns]);

  // SSE 완료 시 대시보드 새로고침
  useEffect(() => {
    if (streamingData.isComplete && sseJobId) {
      queryClient.invalidateQueries({ queryKey: getGetDashboardsQueryKey() });
      setSseJobId(null);
    }
  }, [streamingData.isComplete, sseJobId, queryClient]);

  // SSE 에러 처리
  useEffect(() => {
    if (streamingData.error) {
      setIsInputLoading(false);
      console.error("SSE Error:", streamingData.error);
    }
  }, [streamingData.error]);

  const handleSseSubmit = (url: string) => {
    setIsInputLoading(true);
    startSummarize(url);
  };

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

    // localColumns가 있으면 그것을 사용 (드래그 중 업데이트된 상태)
    const currentColumns = localColumns || columns;

    // 현재 상태에서 카드가 속한 컬럼 찾기
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

    // 현재 카드의 위치 찾기 (이미 이동된 상태)
    const currentCardIndex = overColumn.jobs.findIndex((job) => job.id === activeId);

    // 원래 위치와 현재 위치 비교
    const isSamePosition = originalColumnId === overColumn.id && originalIndex === currentCardIndex;

    if (isSamePosition || currentCardIndex === -1) {
      setActiveId(null);
      setOriginalColumnId(null);
      setOriginalIndex(null);
      return;
    }

    // 현재 위치 기준으로 이전/이후 카드 ID 계산
    const prevItemId = currentCardIndex > 0 ? overColumn.jobs[currentCardIndex - 1]?.id : undefined;
    const nextItemId =
      currentCardIndex < overColumn.jobs.length - 1
        ? overColumn.jobs[currentCardIndex + 1]?.id
        : undefined;

    // Optimistic Update: 캐시를 현재 로컬 상태로 업데이트
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

    // 로컬 상태 초기화 (캐시 데이터 사용)
    setLocalColumns(null);

    // API 호출
    moveMutation.mutate({
      summaryId: activeId,
      data: {
        dashboardId: Number(overColumn.id),
        prevItemId,
        nextItemId
      }
    });

    setActiveId(null);
    setOriginalColumnId(null);
    setOriginalIndex(null);
  };

  const handleCardClick = (job: Job, columnId: string) => {
    setSelectedJob(job);
    setSelectedDashboardId(Number(columnId));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setSelectedDashboardId(undefined);
    setSseJobId(null);
    resetSse();
  };

  const activeJob = activeId
    ? displayColumns.flatMap((col) => col.jobs).find((job) => job.id === activeId)
    : null;

  const initialModalData = useMemo(() => {
    if (!selectedJob || selectedJob.id < 0) return null;

    // selectedJob에는 id, companyName, title, deadline 등이 있음
    // dashboardsData에서 더 상세한 정보를 찾을 수 있다면 좋지만,
    // 현재 dashboardsData 구조상 jobPostings에 상세 정보가 포함되어 있음
    const allJobs = dashboardsData?.flatMap((d) => d.jobPostings || []) || [];
    return allJobs.find((jp) => jp.id === selectedJob.id);
  }, [selectedJob, dashboardsData]);

  if (!mounted) {
    return (
      <div className="flex w-full flex-1 flex-col overflow-x-auto bg-[#F6F7F9]">
        <div className="flex min-w-fit flex-1 gap-[20px] px-[80px] py-8 min-[1920px]:gap-[32px] min-[1920px]:px-[240px]">
          {displayColumns.flatMap((column, index) => [
            <div key={column.id} className="flex min-w-[180px] flex-1 flex-col gap-[16px]">
              <StatusHeader title={column.title} count={column.jobs.length} />
              <div className="flex flex-1 flex-col gap-[16px] min-h-[200px]">
                {column.jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    type={job.type || "white"}
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
              type={activeJob.type || "white"}
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
        dashboardId={selectedDashboardId}
        jobPostingId={selectedJob?.id && selectedJob.id > 0 ? selectedJob.id : undefined}
        initialData={initialModalData}
        sseData={streamingData.metadata ? streamingData : undefined}
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
