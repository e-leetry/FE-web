"use client";

import React, { useState } from "react";
import { StatusHeader } from "@/components/dashboard/status-header";
import { JobCard } from "@/components/dashboard/job-card";
import { CardDetailModal } from "@/components/common/card-detail-modal";

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

const COLUMNS: Column[] = [
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

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleCardClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="flex w-full flex-1 flex-col overflow-x-auto bg-[#F6F7F9]">
      <div className="flex min-w-fit flex-1 gap-[20px] px-[80px] py-8 min-[1920px]:gap-[32px] min-[1920px]:px-[240px]">
        {COLUMNS.flatMap((column, index) => [
          <div key={column.id} className="flex min-w-[180px] flex-1 flex-col gap-[16px]">
            <StatusHeader title={column.title} count={column.jobs.length} />
            <div className="flex flex-col gap-[16px]">
              {column.jobs.map((job) => (
                <JobCard
                  key={job.id}
                  type={job.type || "white"}
                  company={job.company}
                  position={job.position}
                  deadline={job.deadline}
                  onClick={() => handleCardClick(job)}
                />
              ))}
              <JobCard type="add" />
            </div>
          </div>,
          ...(index < COLUMNS.length - 1
            ? [
                <div
                  key={`sep-${index}`}
                  className="w-[1px] flex-shrink-0 self-stretch bg-[#E9E9E9]"
                />
              ]
            : [])
        ])}
      </div>

      <CardDetailModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
