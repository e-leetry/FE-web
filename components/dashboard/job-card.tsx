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
  onClick
}: JobCardProps) {
  if (type === "add") {
    return (
      <Card
        onClick={onClick}
        className={cn(
          "flex h-[144px] w-[180px] cursor-pointer flex-row items-center justify-center gap-2 rounded-[16px] border-dashed border-[#D1D5DB] bg-transparent p-[20px] shadow-none hover:bg-slate-50 min-[1440px]:w-[236px]",
          className
        )}
      >
        <span className="text-[16px] font-[500] leading-[19.09px] tracking-[-0.32px] text-[#A5A5A5]">
          채용공고 추가
        </span>
        <Image src="/images/dashboard/ico_add.svg" alt="Add" width={16} height={16} />
      </Card>
    );
  }

  if (type === "loading") {
    return (
      <Card
        onClick={onClick}
        className={cn(
          "flex h-[144px] w-[180px] cursor-pointer flex-col justify-between rounded-[16px] bg-white p-[20px] shadow-[0px_2px_8px_rgba(0,0,0,0.04)] min-[1440px]:w-[236px]",
          className
        )}
      >
        <div className="flex flex-col gap-[8px]">
          <span className="text-[16px] font-[600] leading-[24px] tracking-[-0.32px] text-[#343E4C]">
            {company}
          </span>
          <span className="text-[13px] font-[500] leading-[15.52px] tracking-[-0.26px] text-[#343E4C]">
            {company}
          </span>
        </div>
        <div className="flex items-center gap-[4px]">
          <div className="flex h-5 w-5 items-center justify-center">
            {/* Simple loading spinner placeholder or the image downloaded */}
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#343E4C] border-t-transparent" />
          </div>
          <span className="text-[14px] font-[400] leading-[16.71px] tracking-[-0.28px] text-[#343E4C]">
            불러오는 중
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        "flex h-[144px] w-[180px] cursor-pointer flex-col justify-between rounded-[16px] bg-[#FAFAFA] p-[20px] shadow-[0px_2px_8px_rgba(0,0,0,0.04)] min-[1440px]:w-[236px]",
        className
      )}
    >
      <div className="flex flex-col gap-[8px]">
        <span className="text-[16px] font-[600] leading-[24px] tracking-[-0.32px] text-[#343E4C]">
          {company}
        </span>
        <span className="text-[13px] font-[600] leading-[15.52px] tracking-[-0.26px] text-[#343E4C]">
          {position}
        </span>
      </div>
      <div className="text-[14px] font-[400] leading-[16.71px] tracking-[-0.28px] text-[#343E4C]">
        -{deadline} 까지
      </div>
    </Card>
  );
}
