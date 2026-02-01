"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StatusHeader } from "@/components/dashboard/status-header";
import { JobCard } from "@/components/dashboard/job-card";
import { CardDetailModal } from "@/components/common/card-detail-modal";
import { FloatingInputButton } from "@/components/features/dashboard/floating-input-button";
import { LocalJob } from "@/lib/hooks/use-local-dashboard";
import type { SseStreamingData } from "@/lib/hooks/use-job-summarize-sse";
import { showToast } from "@/store/ui/toast-store";
import {
  findColumnByIdOrJob,
  reorderJobsInColumn,
  moveJobBetweenColumns,
  isSameDropPosition,
  findJobIndexInColumn
} from "@/lib/utils/kanban-utils";
import type { Job, Column } from "@/lib/utils/kanban-utils";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { buildLoginRedirect } from "@/lib/auth/routes";

export type { Job, Column } from "@/lib/utils/kanban-utils";

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
  selectedColumnId: number | undefined;
  setSelectedColumnId: (id: number | undefined) => void;
  // 로그인 여부에 따른 처리
  isLoggedIn: boolean;
  // 초기 모달 데이터
  initialModalData: LocalJob | null | undefined;
  // SSE 데이터
  sseData?: SseStreamingData;
  // 드래그 앤 드롭 핸들러
  onDragEnd: (
    activeId: number,
    overColumnId: number,
    currentCardIndex: number,
    originalColumnId: number | null,
    originalIndex: number | null,
    currentColumns: Column[]
  ) => void;
  // 모달 핸들러
  onCloseModal: () => void;
  onSaveToLocal?: (jobData: LocalJob) => void;
  onDeleteLocal?: (jobId: number) => void;
  onSaveButtonClick?: () => void | boolean;
  loginRedirectPath?: string;
}

function KanbanColumn({
  column,
  handleCardClick
}: {
  column: Column;
  handleCardClick: (job: Job, columnId: number) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: column.id
  });

  return (
    <div className="flex min-w-[180px] flex-1 flex-col gap-[16px]">
      <StatusHeader title={column.title} count={column.jobs.length} />
      <SortableContext
        id={String(column.id)}
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
            id={`add-${column.id}`}
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
  onSaveButtonClick,
  loginRedirectPath
}: DashboardBoardProps) {
  const router = useRouter();
  const [localColumns, setLocalColumns] = useState<Column[] | null>(null);
  const [prevColumns, setPrevColumns] = useState<Column[]>(columns);
  const resetPreviewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (columns !== prevColumns) {
    setLocalColumns(null);
    setPrevColumns(columns);
  }

  const displayColumns = localColumns || columns;

  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [originalColumnId, setOriginalColumnId] = useState<number | null>(null);
  const [originalIndex, setOriginalIndex] = useState<number | null>(null);
  const loginRedirectUrl = useMemo(
    () => buildLoginRedirect(loginRedirectPath ?? "/dashboard"),
    [loginRedirectPath]
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

  const handleDragStart = (event: DragStartEvent) => {
    const rawId = event.active.id;

    // 문자열 ID(add 카드)는 드래그 대상이 아님
    if (typeof rawId === "string" && rawId.startsWith("add-")) {
      return;
    }

    const dragActiveId = typeof rawId === "number" ? rawId : Number(rawId);
    if (isNaN(dragActiveId)) return;

    // 드래그 시작 시 activeJob을 저장 (드래그 중 columns가 변경되어도 유지)
    const job = displayColumns.flatMap((col) => col.jobs).find((j) => j.id === dragActiveId);
    if (!job) return;

    setActiveJob(job);
    setActiveId(dragActiveId);

    const activeColumn = findColumnByIdOrJob(displayColumns, dragActiveId);
    if (activeColumn) {
      setOriginalColumnId(activeColumn.id);
      setOriginalIndex(findJobIndexInColumn(activeColumn, dragActiveId));
    }
  };

  useEffect(() => {
    return () => {
      if (resetPreviewTimeoutRef.current) {
        clearTimeout(resetPreviewTimeoutRef.current);
      }
    };
  }, []);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const rawActiveId = active.id;
    if (typeof rawActiveId === "string" && rawActiveId.startsWith("add-")) return;

    const dragActiveId = typeof rawActiveId === "number" ? rawActiveId : Number(rawActiveId);
    if (isNaN(dragActiveId)) return;

    const rawOverId = over.id;
    const numericOverId = typeof rawOverId === "number" ? rawOverId : parseInt(String(rawOverId), 10);
    if (isNaN(numericOverId)) return; // add 카드 같은 비정상 ID면 무시

    setLocalColumns((prev) => {
      const currentColumns = prev || columns;

      const activeColumn = findColumnByIdOrJob(currentColumns, dragActiveId);
      const overColumn = findColumnByIdOrJob(currentColumns, numericOverId);

      if (!activeColumn || !overColumn) return prev;

      if (activeColumn.id === overColumn.id) {
        return reorderJobsInColumn(currentColumns, activeColumn.id, dragActiveId, numericOverId);
      }

      return moveJobBetweenColumns(
        currentColumns,
        activeColumn.id,
        overColumn.id,
        dragActiveId,
        numericOverId
      );
    });
  };

  const resetDragState = useCallback(() => {
    setActiveId(null);
    setActiveJob(null);
    setOriginalColumnId(null);
    setOriginalIndex(null);
  }, []);

  const cancelDrag = useCallback(() => {
    setLocalColumns(null);
    resetDragState();
  }, [resetDragState]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      cancelDrag();
      return;
    }

    const rawActiveId = active.id;
    if (typeof rawActiveId === "string" && rawActiveId.startsWith("add-")) {
      cancelDrag();
      return;
    }

    const dragActiveId = typeof rawActiveId === "number" ? rawActiveId : Number(rawActiveId);
    if (isNaN(dragActiveId)) {
      cancelDrag();
      return;
    }

    if (!isLoggedIn) {
      showToast({
        variant: "error",
        leftElement: "로그인한 사용자만 수정할 수 있어요"
      });
      router.push(loginRedirectUrl);
      cancelDrag();
      return;
    }

    const currentColumns = localColumns || columns;
    const rawOverId = over.id;
    const numericOverId = typeof rawOverId === "number" ? rawOverId : parseInt(String(rawOverId), 10);
    if (isNaN(numericOverId)) {
      cancelDrag();
      return;
    }
    const overColumn = findColumnByIdOrJob(currentColumns, numericOverId);

    if (!overColumn) {
      cancelDrag();
      return;
    }

    const currentCardIndex = findJobIndexInColumn(overColumn, dragActiveId);

    if (
      currentCardIndex === -1 ||
      isSameDropPosition(originalColumnId, overColumn.id, originalIndex, currentCardIndex)
    ) {
      cancelDrag();
      return;
    }

    onDragEnd(
      dragActiveId,
      overColumn.id,
      currentCardIndex,
      originalColumnId,
      originalIndex,
      currentColumns
    );

    resetDragState();
  };

  const handleCardClick = (job: Job, columnId: number) => {
    if (job.type === "add" && !isLoggedIn) {
      showToast({
        variant: "error",
        leftElement: "로그인한 사용자만 공고를 추가할 수 있어요"
      });
      router.push(loginRedirectUrl);
      return;
    }
    setSelectedJob(job);
    setSelectedColumnId(columnId);
    setIsModalOpen(true);
  };

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
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CardDetailModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        dashboardId={selectedColumnId}
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
