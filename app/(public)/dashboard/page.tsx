"use client";

import { StatusHeader } from "@/components/dashboard/status-header";
import { JobCard } from "@/components/dashboard/job-card";

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
    jobs: [
      { id: 1, company: "엔카닷컴", type: "loading" },
    ],
  },
  {
    id: "applied",
    title: "서류제출",
    jobs: [
      { id: 2, company: "네이버", position: "Product Designer", deadline: "25. 10. 19" },
    ],
  },
  {
    id: "interview1",
    title: "1차면접",
    jobs: [],
  },
  {
    id: "interview2",
    title: "2차면접",
    jobs: [],
  },
  {
    id: "final",
    title: "최종합격",
    jobs: [],
  },
];

export default function DashboardPage() {
  return (
    <div className="flex h-full w-full flex-col bg-[#F9FAFB]">
      <main className="flex-1 overflow-x-auto pt-[64px]">
        <div className="flex h-full min-w-max p-8">
          {COLUMNS.map((column, index) => (
            <div key={column.id} className="flex flex-row">
              <div className="flex w-[248px] flex-col gap-4">
                <StatusHeader title={column.title} count={column.jobs.length} />
                <div className="flex flex-col gap-3">
                  {column.jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      type={job.type || "white"}
                      company={job.company}
                      position={job.position}
                      deadline={job.deadline}
                    />
                  ))}
                  <JobCard type="add" />
                </div>
              </div>
              {index < COLUMNS.length - 1 && (
                <div className="mx-6 w-[1px] self-stretch bg-[#E5E7EB]" />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
