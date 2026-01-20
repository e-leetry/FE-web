"use client";

import React, { useEffect, useMemo, useState } from "react";
import { StatusHeader } from "@/components/dashboard/status-header";
import { JobCard } from "@/components/dashboard/job-card";
import { CardDetailModal } from "@/components/common/card-detail-modal";
import { useAuth } from "@/lib/auth/useAuth";
import { useGetDashboards } from "@/lib/api/generated/dashboard/dashboard";
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
    jobs: [{ id: 1, companyName: "엔카닷컴", type: "loading" }]
  },
  {
    id: "applied",
    title: "서류제출",
    jobs: [{ id: 2, companyName: "네이버", title: "Product Designer", deadline: "25. 10. 19" }]
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
  const { data: dashboardsData } = useGetDashboards({
    query: {
      enabled: isLoggedIn
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
  const displayColumns = localColumns || columns;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedDashboardId, setSelectedDashboardId] = useState<number | undefined>(undefined);
  const [activeId, setActiveId] = useState<number | null>(null);

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
        distance: 8
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
    setActiveId(event.active.id as number);
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
      return;
    }

    const activeId = active.id as number;
    const overId = over.id as number | string;

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (activeColumn && overColumn && activeColumn === overColumn) {
      const activeIndex = activeColumn.jobs.findIndex((job) => job.id === activeId);
      const overIndex = overColumn.jobs.findIndex((job) => job.id === overId);

      if (activeIndex !== overIndex) {
        setLocalColumns((prev) => {
          const currentColumns = prev || columns;
          return currentColumns.map((col) => {
            if (col.id === activeColumn.id) {
              return {
                ...col,
                jobs: arrayMove(col.jobs, activeIndex, overIndex)
              };
            }
            return col;
          });
        });
      }
    }

    setActiveId(null);
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
      />
    </div>
  );
}
