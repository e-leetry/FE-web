"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StatusHeader } from "@/components/dashboard/status-header";
import { JobCard } from "@/components/dashboard/job-card";
import { CardDetailModal } from "@/components/common/card-detail-modal";
import { FloatingInputButton } from "@/components/features/dashboard/floating-input-button";
import { LocalJob } from "@/lib/hooks/use-local-dashboard";
import type { SseStreamingData } from "@/lib/hooks/use-job-summarize-sse";
import { showToast } from "@/store/ui/toast-store";
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

interface DashboardBoardProps {
  columns: Column[];
  mounted: boolean;
  isInputOpen: boolean;
  setIsInputOpen: (open: boolean) => void;
  isInputLoading: boolean;
  onSseSubmit: (url: string) => void;
  // 모달 관련
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  selectedColumnId: string | undefined;
  setSelectedColumnId: (id: string | undefined) => void;
  // 로그인 여부에 따른 처리
  isLoggedIn: boolean;
  // 초기 모달 데이터
  initialModalData: LocalJob | null | undefined;
  // SSE 데이터
  sseData?: SseStreamingData;
  // 드래그 앤 드롭 핸들러
  onDragEnd: (
    activeId: number,
    overColumnId: string,
    currentCardIndex: number,
    originalColumnId: string | null,
    originalIndex: number | null,
    currentColumns: Column[]
  ) => void;
  // 모달 핸들러
  onCloseModal: () => void;
  onSaveToLocal?: (jobData: LocalJob) => void;
  onDeleteLocal?: (jobId: number) => void;
  onSaveButtonClick?: () => void | boolean;
}

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
              url={job.url}
              onClick={() => handleCardClick(job, column.id)}
            />
          ))}
          <JobCard
            type="add"
            onClick={() =>
              handleCardClick({ id: -Date.now(), companyName: "", type: "add" }, column.id)
            }
          />
        </div>
      </SortableContext>
    </div>
  );
}

export function DashboardBoard({
  columns,
  mounted,
  isInputOpen,
  setIsInputOpen,
  isInputLoading,
  onSseSubmit,
  isModalOpen,
  setIsModalOpen,
  selectedJob,
  setSelectedJob,
  selectedColumnId,
  setSelectedColumnId,
  isLoggedIn,
  initialModalData,
  sseData,
  onDragEnd,
  onCloseModal,
  onSaveToLocal,
  onDeleteLocal,
  onSaveButtonClick
}: DashboardBoardProps) {
  const router = useRouter();
  const [localColumns, setLocalColumns] = useState<Column[] | null>(null);
  const [prevColumns, setPrevColumns] = useState<Column[]>(columns);

  if (columns !== prevColumns) {
    setLocalColumns(null);
    setPrevColumns(columns);
  }

  const displayColumns = localColumns || columns;

  const [activeId, setActiveId] = useState<number | null>(null);
  const [originalColumnId, setOriginalColumnId] = useState<string | null>(null);
  const [originalIndex, setOriginalIndex] = useState<number | null>(null);

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

  const findColumn = useCallback(
    (id: number | string) => {
      if (displayColumns.some((col) => col.id === id)) {
        return displayColumns.find((col) => col.id === id);
      }
      return displayColumns.find((col) => col.jobs.some((job) => job.id === id));
    },
    [displayColumns]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const dragActiveId = event.active.id as number;
    setActiveId(dragActiveId);

    const activeColumn = findColumn(dragActiveId);
    if (activeColumn) {
      setOriginalColumnId(activeColumn.id);
      setOriginalIndex(activeColumn.jobs.findIndex((job) => job.id === dragActiveId));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const dragActiveId = active.id as number;
    const overId = over.id as number | string;

    const activeColumn = findColumn(dragActiveId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn) {
      return;
    }

    // 같은 컬럼 내에서 순서 변경
    if (activeColumn === overColumn) {
      setLocalColumns((prev) => {
        const currentColumns = prev || columns;
        const columnJobs = [...activeColumn.jobs];

        const activeIndex = columnJobs.findIndex((job) => job.id === dragActiveId);
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

      const activeIndex = activeJobs.findIndex((job) => job.id === dragActiveId);
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

    const dragActiveId = active.id as number;
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

    const currentCardIndex = overColumn.jobs.findIndex((job) => job.id === dragActiveId);
    const isSamePosition = originalColumnId === overColumn.id && originalIndex === currentCardIndex;

    if (isSamePosition || currentCardIndex === -1) {
      setActiveId(null);
      setOriginalColumnId(null);
      setOriginalIndex(null);
      return;
    }

    // 부모 컴포넌트에 드래그 완료 알림
    onDragEnd(
      dragActiveId,
      overColumn.id,
      currentCardIndex,
      originalColumnId,
      originalIndex,
      currentColumns
    );

    console.log("드롭되었습니다");

    setLocalColumns(null);
    setActiveId(null);
    setOriginalColumnId(null);
    setOriginalIndex(null);
  };

  const handleCardClick = (job: Job, columnId: string) => {
    if (job.type === "add" && !isLoggedIn) {
      showToast({
        variant: "error",
        leftElement: "로그인한 사용자만 공고를 추가할 수 있어요"
      });
      router.push("/login");
      return;
    }
    setSelectedJob(job);
    setSelectedColumnId(columnId);
    setIsModalOpen(true);
  };

  const activeJob = activeId
    ? displayColumns.flatMap((col) => col.jobs).find((job) => job.id === activeId)
    : null;

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
              url={activeJob.url}
              className="rotate-3 scale-105 shadow-xl transition-transform"
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CardDetailModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        dashboardId={selectedColumnId ? Number(selectedColumnId) : undefined}
        jobPostingId={selectedJob?.id && selectedJob.id > 0 ? selectedJob.id : undefined}
        initialData={initialModalData}
        sseData={sseData?.metadata ? sseData : undefined}
        isLoggedIn={isLoggedIn}
        onSaveToLocal={onSaveToLocal}
        onDeleteLocal={onDeleteLocal}
      />
      <FloatingInputButton
        isOpen={isInputOpen}
        onOpenChange={setIsInputOpen}
        isLoading={isInputLoading}
        onSubmit={onSseSubmit}
        onButtonClick={onSaveButtonClick}
      />
    </div>
  );
}
