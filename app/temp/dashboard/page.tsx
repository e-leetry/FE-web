"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  type CollisionDetection
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DashboardResponse } from "@/lib/api/generated/model/dashboardResponse";
import type { JobPostingSummaryResponse } from "@/lib/api/generated/model/jobPostingSummaryResponse";

// ============================================
// Mock Data
// ============================================
const MOCK_DASHBOARDS: DashboardResponse[] = [
  {
    id: 1,
    label: "관심공고",
    sortOrder: 0,
    jobPostings: [
      {
        id: 101,
        dashboardId: 1,
        title: "프론트엔드 개발자",
        companyName: "엔카닷컴",
        url: "https://example.com/job/1",
        deadline: "2025-10-19",
        platform: "WANTED",
        sortOrder: 0
      },
      {
        id: 102,
        dashboardId: 1,
        title: "React 개발자",
        companyName: "네이버",
        url: "https://example.com/job/2",
        deadline: "2025-11-30",
        platform: "WANTED",
        sortOrder: 1
      },
      {
        id: 103,
        dashboardId: 1,
        title: "웹 개발자",
        companyName: "토스",
        url: "https://example.com/job/8",
        deadline: "2025-12-01",
        platform: "WANTED",
        sortOrder: 2
      }
    ]
  },
  {
    id: 2,
    label: "서류지원",
    sortOrder: 1,
    jobPostings: [
      {
        id: 201,
        dashboardId: 2,
        title: "풀스택 개발자",
        companyName: "카카오",
        url: "https://example.com/job/3",
        deadline: "2025-12-15",
        platform: "UNKNOWN",
        sortOrder: 0
      },
      {
        id: 202,
        dashboardId: 2,
        title: "프론트엔드 엔지니어",
        companyName: "라인",
        url: "https://example.com/job/4",
        deadline: "2025-11-20",
        platform: "WANTED",
        sortOrder: 1
      }
    ]
  },
  {
    id: 3,
    label: "1차면접",
    sortOrder: 2,
    jobPostings: [
      {
        id: 301,
        dashboardId: 3,
        title: "시니어 개발자",
        companyName: "쿠팡",
        url: "https://example.com/job/5",
        deadline: "2025-12-10",
        platform: "WANTED",
        sortOrder: 0
      }
    ]
  },
  {
    id: 4,
    label: "2차면접",
    sortOrder: 3,
    jobPostings: [
      {
        id: 401,
        dashboardId: 4,
        title: "Software Engineer",
        companyName: "당근",
        url: "https://example.com/job/6",
        deadline: "2025-12-20",
        platform: "WANTED",
        sortOrder: 0
      }
    ]
  },
  {
    id: 5,
    label: "합격",
    sortOrder: 4,
    jobPostings: [
      {
        id: 501,
        dashboardId: 5,
        title: "주니어 개발자",
        companyName: "배달의민족",
        url: "https://example.com/job/7",
        deadline: "2025-10-01",
        platform: "UNKNOWN",
        sortOrder: 0
      }
    ]
  }
];

// ============================================
// StatusHeader Component
// ============================================
function StatusHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="text-[18px] font-[700] leading-[21.48px] tracking-[-0.36px] text-[#343E4C]">
        {title}
      </span>
      <div className="flex h-[20px] min-w-[20px] items-center justify-center rounded-[6px] bg-[#EE6D68] px-1.5">
        <span className="text-[14px] font-[700] leading-[14px] tracking-[-0.28px] text-white">
          {count}
        </span>
      </div>
    </div>
  );
}

// ============================================
// JobCard Component
// ============================================
const formatDeadline = (deadline?: string) => {
  if (!deadline) return "";
  const digitsOnly = deadline.replace(/[^0-9]/g, "");
  if (digitsOnly.length < 6) return deadline.trim();
  const normalized = digitsOnly.length >= 8 ? digitsOnly.slice(-8) : digitsOnly.slice(-6);
  const year = normalized.length === 8 ? normalized.slice(2, 4) : normalized.slice(0, 2);
  const month = normalized.length === 8 ? normalized.slice(4, 6) : normalized.slice(2, 4);
  const day = normalized.length === 8 ? normalized.slice(6, 8) : normalized.slice(4, 6);
  if (!year || !month || !day) return deadline.trim();
  return `${year}. ${month.padStart(2, "0")}. ${day.padStart(2, "0")}`;
};

interface JobCardProps {
  id: number;
  type?: "default" | "add";
  companyName?: string;
  title?: string;
  deadline?: string;
  url?: string;
  className?: string;
  isOverlay?: boolean;
}

function JobCard({
  id,
  type = "default",
  companyName,
  title,
  deadline,
  url,
  className,
  isOverlay = false
}: JobCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id,
    disabled: isOverlay || type === "add"
  });

  const formattedDeadline = formatDeadline(deadline);

  const style = isOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? "none" : "transform 150ms ease",
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? -1 : undefined
      };

  if (type === "add") {
    return (
      <Card
        className={cn(
          "flex shrink-0 cursor-pointer flex-row items-center justify-center gap-2 rounded-[16px] border-[1.5px] border-dashed border-[#DDDDDD] bg-transparent p-[16px_20px] shadow-[0px_2px_8px_rgba(0,0,0,0.05)] hover:bg-slate-50",
          "w-[180px] min-[1440px]:w-[224px]",
          "h-[144px]",
          className
        )}
      >
        <span className="text-[16px] font-medium leading-[1.5] tracking-[-0.02em] text-[#A5A5A5]">
          채용공고 추가
        </span>
        <Image src="/images/dashboard/ico_add.svg" alt="Add" width={16} height={16} />
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative flex shrink-0 cursor-grab flex-col rounded-[16px] bg-white p-[16px_20px] shadow-[0px_2px_8px_rgba(0,0,0,0.05)] active:cursor-grabbing",
        "w-[180px] min-[1440px]:w-[224px]",
        "h-[144px] justify-between gap-[16px]",
        className
      )}
    >
      <div className="flex flex-col gap-[4px]">
        <span className="text-[16px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#3E3E3E]">
          {companyName}
        </span>
        <span className="text-[13px] font-medium leading-[1.5] tracking-[-0.02em] text-[#5C5C5C]">
          {title}
        </span>
      </div>

      {url && (
        <div className="absolute right-[12px] top-[12px] rounded p-1">
          <Image src="/images/dashboard/ico_more.svg" alt="More" width={16} height={16} />
        </div>
      )}

      {formattedDeadline && (
        <div className="flex items-center gap-[8px]">
          <span className="text-[14px] font-normal leading-[1.19] tracking-[-0.02em] text-[#9E9E9E]">
            ~{formattedDeadline} 까지
          </span>
        </div>
      )}
    </Card>
  );
}

// ============================================
// KanbanColumn Component
// ============================================
function KanbanColumn({ column }: { column: DashboardResponse }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id }
  });

  return (
    <div className="flex min-w-[180px] flex-1 flex-col gap-[16px]">
      <StatusHeader title={column.label} count={column.jobPostings.length} />
      <SortableContext
        id={String(column.id)}
        items={column.jobPostings.map((job) => job.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={cn(
            "flex min-h-[300px] flex-1 flex-col gap-[16px] rounded-lg p-2 transition-colors",
            isOver && column.jobPostings.length === 0 && "bg-gray-100"
          )}
        >
          {column.jobPostings.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              type="default"
              companyName={job.companyName}
              title={job.title}
              deadline={job.deadline}
              url={job.url}
            />
          ))}
          <JobCard id={-column.id} type="add" />
        </div>
      </SortableContext>
    </div>
  );
}

// ============================================
// Main Page Component
// ============================================
// Custom collision detection: 카드는 pointerWithin, 컬럼은 rectIntersection
const customCollisionDetection: CollisionDetection = (args) => {
  // 먼저 pointerWithin으로 카드 감지 시도
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }
  // 카드가 없으면 rectIntersection으로 컬럼 감지
  return rectIntersection(args);
};

export default function TempDashboardPage() {
  const [columns, setColumns] = useState<DashboardResponse[]>(MOCK_DASHBOARDS);
  const [activeJob, setActiveJob] = useState<JobPostingSummaryResponse | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const rawId = event.active.id;
    const dragActiveId = typeof rawId === "number" ? rawId : Number(rawId);

    if (isNaN(dragActiveId) || dragActiveId < 0) return;

    const job = columns.flatMap((col) => col.jobPostings).find((j) => j.id === dragActiveId);

    if (job) {
      setActiveJob(job);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const rawActiveId = active.id;
    const dragActiveId = typeof rawActiveId === "number" ? rawActiveId : Number(rawActiveId);
    if (isNaN(dragActiveId) || dragActiveId < 0) return;

    const rawOverId = over.id;
    const numericOverId =
      typeof rawOverId === "number" ? rawOverId : parseInt(String(rawOverId), 10);
    if (isNaN(numericOverId)) return;

    const isOverColumn = over.data?.current?.type === "column";

    // over 요소의 rect와 드래그 위치로 위/아래 판단
    const overRect = over.rect;
    const dragY = active.rect.current.translated?.top ?? 0;
    const overCenterY = overRect.top + overRect.height / 2;
    const isBelowCenter = dragY > overCenterY;

    setColumns((prev) => {
      const activeColumn = prev.find((col) =>
        col.jobPostings.some((job) => job.id === dragActiveId)
      );

      let overColumn: DashboardResponse | undefined;
      if (isOverColumn) {
        overColumn = prev.find((col) => col.id === numericOverId);
      } else {
        overColumn = prev.find((col) => col.jobPostings.some((job) => job.id === numericOverId));
      }

      if (!activeColumn || !overColumn) return prev;

      // Same column - reorder (단순히 위치 교환)
      if (activeColumn.id === overColumn.id) {
        const activeIndex = activeColumn.jobPostings.findIndex((job) => job.id === dragActiveId);
        const overIndex = activeColumn.jobPostings.findIndex((job) => job.id === numericOverId);

        if (activeIndex === -1) return prev;
        if (overIndex === -1) return prev;
        if (activeIndex === overIndex) return prev;

        const newJobPostings = arrayMove(activeColumn.jobPostings, activeIndex, overIndex);

        return prev.map((col) =>
          col.id === activeColumn.id ? { ...col, jobPostings: newJobPostings } : col
        );
      }

      // Different column - move
      const activeIndex = activeColumn.jobPostings.findIndex((job) => job.id === dragActiveId);
      if (activeIndex === -1) return prev;

      const movedJob = {
        ...activeColumn.jobPostings[activeIndex],
        dashboardId: overColumn.id
      };

      const newActiveJobPostings = activeColumn.jobPostings.filter(
        (job) => job.id !== dragActiveId
      );

      let newOverJobPostings = [...overColumn.jobPostings];
      if (isOverColumn) {
        // 빈 컬럼에 드롭 - 맨 뒤에 추가
        newOverJobPostings.push(movedJob);
      } else {
        // 카드 위에 드롭 - 마우스 Y 위치에 따라 위/아래 결정
        const overIndex = overColumn.jobPostings.findIndex((job) => job.id === numericOverId);
        const insertIndex = isBelowCenter ? overIndex + 1 : overIndex;
        newOverJobPostings.splice(insertIndex, 0, movedJob);
      }

      return prev.map((col) => {
        if (col.id === activeColumn.id) {
          return { ...col, jobPostings: newActiveJobPostings };
        }
        if (col.id === overColumn.id) {
          return { ...col, jobPostings: newOverJobPostings };
        }
        return col;
      });
    });
  };

  const handleDragEnd = () => {
    setActiveJob(null);
  };

  const handleDragCancel = () => {
    setActiveJob(null);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* Header */}
      <header className="flex h-[60px] items-center justify-between border-b border-gray-100 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
            <span className="text-sm font-bold text-white">R</span>
          </div>
          <span className="text-[18px] font-bold text-gray-900">리트</span>
        </div>
        <button className="text-[14px] text-gray-600 hover:text-gray-900">로그인</button>
      </header>

      {/* Kanban Board */}
      <div className="flex w-full flex-1 flex-col overflow-x-auto bg-[#F6F7F9]">
        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionDetection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex min-w-fit flex-1 gap-[20px] px-[80px] py-8 min-[1920px]:gap-[32px] min-[1920px]:px-[240px]">
            {columns.map((column, index) => (
              <React.Fragment key={column.id}>
                <KanbanColumn column={column} />
                {index < columns.length - 1 && (
                  <div className="w-[1px] flex-shrink-0 self-stretch bg-[#E9E9E9]" />
                )}
              </React.Fragment>
            ))}
          </div>

          <DragOverlay dropAnimation={{ duration: 150, easing: "ease-out" }}>
            {activeJob ? (
              <JobCard
                id={activeJob.id}
                type="default"
                companyName={activeJob.companyName}
                title={activeJob.title}
                deadline={activeJob.deadline}
                url={activeJob.url}
                className="rotate-3 scale-105 shadow-xl"
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Floating Input */}
      <div className="fixed bottom-8 left-1/2 z-50 w-full max-w-[600px] -translate-x-1/2 px-4">
        <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-6 py-4 shadow-lg">
          <input
            type="text"
            placeholder="채용공고의 링크를 입력해주세요"
            className="flex-1 border-none bg-transparent text-[15px] outline-none placeholder:text-gray-400"
          />
          <button className="rounded-lg bg-gray-900 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-gray-800">
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}
