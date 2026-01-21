"use client";

import React, { useEffect, useMemo, useState } from "react";
import { StatusHeader } from "@/components/dashboard/status-header";
import { JobCard } from "@/components/dashboard/job-card";
import { CardDetailModal } from "@/components/common/card-detail-modal";
import { FloatingActionButton } from "@/components/features/dashboard/floating-action-button";
import { useAuth } from "@/lib/auth/useAuth";
import { useGetDashboards, getGetDashboardsQueryKey } from "@/lib/api/generated/dashboard/dashboard";
import { useMove } from "@/lib/api/generated/job-posting-summary/job-posting-summary";
import { useQueryClient } from "@tanstack/react-query";
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
  const { data: dashboardsData } = useGetDashboards({
    query: {
      enabled: isLoggedIn
    }
  });

  const moveMutation = useMove({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetDashboardsQueryKey() });
      },
      onError: (error) => {
        console.error("Move mutation failed:", error);
      }
    }
  });

  const columns = useMemo<Column[]>(() => {
    if (isLoggedIn && dashboardsData) {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
      setOriginalIndex(activeColumn.jobs.findIndex(job => job.id === activeId));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number | string;

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return;
    }

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

    const overColumn = findColumn(overId);

    if (!overColumn) {
      setActiveId(null);
      setOriginalColumnId(null);
      setOriginalIndex(null);
      return;
    }

    const overIndex =
      overColumn.id === overId
        ? overColumn.jobs.length
        : overColumn.jobs.findIndex((job) => job.id === overId);

    const targetIndex = overIndex === -1 ? overColumn.jobs.length : overIndex;

    // 원래 위치(컬럼, 인덱스)와 드롭된 위치를 비교
    const isSamePosition = 
      originalColumnId === overColumn.id && originalIndex === targetIndex;

    if (isSamePosition) {
      setActiveId(null);
      setOriginalColumnId(null);
      setOriginalIndex(null);
      return;
    }

    // API 호출
    moveMutation.mutate({
      id: activeId,
      data: {
        dashboardId: Number(overColumn.id),
        sortOrder: targetIndex
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
  };

  const activeJob = activeId
    ? displayColumns.flatMap((col) => col.jobs).find((job) => job.id === activeId)
    : null;

  const initialModalData = useMemo(() => {
    if (!selectedJob || selectedJob.id < 0) return null;
    
    // selectedJob에는 id, companyName, title, deadline 등이 있음
    // dashboardsData에서 더 상세한 정보를 찾을 수 있다면 좋지만, 
    // 현재 dashboardsData 구조상 jobPostings에 상세 정보가 포함되어 있음
    const allJobs = dashboardsData?.flatMap(d => d.jobPostings || []) || [];
    return allJobs.find(jp => jp.id === selectedJob.id);
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
        <FloatingActionButton
          onClick={() => {
            setSelectedJob({ id: -Date.now(), companyName: "" });
            setSelectedDashboardId(Number(displayColumns[0]?.id));
            setIsModalOpen(true);
          }}
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
      />
      <FloatingActionButton
        onClick={() => {
          setSelectedJob({ id: -Date.now(), companyName: "" });
          setSelectedDashboardId(Number(displayColumns[0]?.id));
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}
