"use client";

import React, { useState } from "react";
import { StatusHeader } from "@/components/dashboard/status-header";
import { JobCard } from "@/components/dashboard/job-card";
import { CardDetailModal } from "@/components/common/card-detail-modal";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Job {
  id: number;
  company: string;
  type?: "white" | "loading" | "add";
  position?: string;
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
    jobs: [{ id: 1, company: "엔카닷컴", type: "loading" }]
  },
  {
    id: "applied",
    title: "서류제출",
    jobs: [{ id: 2, company: "네이버", position: "Product Designer", deadline: "25. 10. 19" }]
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

function KanbanColumn({ column, handleCardClick }: { column: Column, handleCardClick: (job: Job) => void }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex min-w-[180px] flex-1 flex-col gap-[16px]">
      <StatusHeader title={column.title} count={column.jobs.length} />
      <SortableContext
        id={column.id}
        items={column.jobs.map((job) => job.id)}
        strategy={verticalListSortingStrategy}
      >
        <div 
          ref={setNodeRef} 
          className="flex flex-1 flex-col gap-[16px] min-h-[200px]"
        >
          {column.jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              type={job.type || "white"}
              company={job.company}
              position={job.position}
              deadline={job.deadline}
              onClick={() => handleCardClick(job)}
            />
          ))}
          <JobCard type="add" />
        </div>
      </SortableContext>
    </div>
  );
}

export default function DashboardPage() {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumn = (id: number | string) => {
    if (columns.some((col) => col.id === id)) {
      return columns.find((col) => col.id === id);
    }
    return columns.find((col) => col.jobs.some((job) => job.id === id));
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

    setColumns((prev) => {
      const activeJobs = [...activeColumn.jobs];
      const overJobs = [...overColumn.jobs];

      const activeIndex = activeJobs.findIndex((job) => job.id === activeId);
      const overIndex = overColumn.id === overId 
        ? overJobs.length 
        : overJobs.findIndex((job) => job.id === overId);

      const [removedJob] = activeJobs.splice(activeIndex, 1);
      overJobs.splice(overIndex, 0, removedJob);

      return prev.map((col) => {
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
        setColumns((prev) =>
          prev.map((col) => {
            if (col.id === activeColumn.id) {
              return {
                ...col,
                jobs: arrayMove(col.jobs, activeIndex, overIndex),
              };
            }
            return col;
          })
        );
      }
    }

    setActiveId(null);
  };

  const handleCardClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const activeJob = activeId 
    ? columns.flatMap(col => col.jobs).find(job => job.id === activeId)
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
          {columns.flatMap((column, index) => [
            <KanbanColumn
              key={column.id}
              column={column}
              handleCardClick={handleCardClick}
            />,
            ...(index < columns.length - 1
              ? [
                  <div
                    key={`sep-${index}`}
                    className="w-[1px] flex-shrink-0 self-stretch bg-[#E9E9E9]"
                  />
                ]
              : [])
          ])}
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.5",
              },
            },
          }),
        }}>
          {activeJob ? (
            <JobCard
              id={activeJob.id}
              type={activeJob.type || "white"}
              company={activeJob.company}
              position={activeJob.position}
              deadline={activeJob.deadline}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CardDetailModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
