"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface JobCardProps {
  type?: "white" | "loading" | "add";
  company?: string;
  position?: string;
  deadline?: string;
  className?: string;
  onClick?: () => void;
}

export function JobCard({
  type = "white",
  company,
  position,
  deadline,
  className,
  onClick,
}: JobCardProps) {
  if (type === "add") {
    return (
      <Card
        onClick={onClick}
        className={cn(
          "flex h-[116px] w-[248px] cursor-pointer flex-col items-center justify-center gap-2 border-dashed border-[#D1D5DB] bg-transparent shadow-none hover:bg-slate-50",
          className
        )}
      >
        <span className="text-[14px] font-medium text-[#9CA3AF]">채용공고 추가</span>
        <Image src="/images/dashboard/ico_add.svg" alt="Add" width={16} height={16} />
      </Card>
    );
  }

  if (type === "loading") {
    return (
      <Card
        className={cn(
          "flex h-[116px] w-[248px] flex-col justify-between p-4 shadow-[0px_2px_8px_rgba(0,0,0,0.04)]",
          className
        )}
      >
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-bold text-[#1F2937]">{company}</span>
        </div>
        <div className="flex items-center gap-2 opacity-70">
          <div className="flex h-5 w-5 items-center justify-center">
             {/* Simple loading spinner placeholder or the image downloaded */}
             <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1F2937] border-t-transparent" />
          </div>
          <span className="text-[13px] text-[#1F2937]">불러오는 중</span>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "flex h-[116px] w-[248px] flex-col justify-between p-4 shadow-[0px_2px_8px_rgba(0,0,0,0.04)]",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[15px] font-bold text-[#1F2937]">{company}</span>
        <span className="text-[13px] text-[#4B5563]">{position}</span>
      </div>
      <div className="text-[12px] text-[#6B7280]">{deadline} 까지</div>
    </Card>
  );
}
