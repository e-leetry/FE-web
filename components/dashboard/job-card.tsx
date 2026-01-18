"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Image from "next/image";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface JobCardProps {
  id?: string | number;
  type?: "white" | "loading" | "add";
  companyName?: string;
  title?: string;
  deadline?: string;
  className?: string;
  onClick?: () => void;
}

export function JobCard({
  id,
  type = "white",
  companyName,
  title,
  deadline,
  className,
  onClick
}: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id ?? "" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 0 : undefined,
  };

  if (type === "add") {
    return (
      <Card
        onClick={onClick}
        className={cn(
          "flex h-[144px] w-[180px] shrink-0 cursor-pointer flex-row items-center justify-center gap-2 rounded-[16px] border-dashed border-[#D1D5DB] bg-transparent p-[20px] shadow-none hover:bg-slate-50 min-[1440px]:w-[236px]",
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
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={onClick}
        className={cn(
          "flex h-[144px] w-[180px] shrink-0 cursor-pointer flex-col justify-between rounded-[16px] bg-white p-[20px] shadow-[0px_2px_8px_rgba(0,0,0,0.04)] min-[1440px]:w-[236px]",
          className
        )}
      >
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-[600] leading-[24px] tracking-[-0.32px] text-[#343E4C]">
              {companyName}
            </span>
            {id && (
              <span className="text-[12px] text-gray-400">
                #{id}
              </span>
            )}
          </div>
          <span className="text-[13px] font-[500] leading-[15.52px] tracking-[-0.26px] text-[#343E4C]">
            {companyName}
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
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "flex h-[144px] w-[180px] shrink-0 cursor-pointer flex-col justify-between rounded-[16px] bg-[#FAFAFA] p-[20px] shadow-[0px_2px_8px_rgba(0,0,0,0.04)] min-[1440px]:w-[236px]",
        className
      )}
    >
      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-[600] leading-[24px] tracking-[-0.32px] text-[#343E4C]">
            {companyName}
          </span>
          {id && (
            <span className="text-[12px] text-gray-400">
              #{id}
            </span>
          )}
        </div>
        <span className="text-[13px] font-[600] leading-[15.52px] tracking-[-0.26px] text-[#343E4C]">
          {title}
        </span>
      </div>
      <div className="text-[14px] font-[400] leading-[16.71px] tracking-[-0.28px] text-[#343E4C]">
        -{deadline} 까지
      </div>
    </Card>
  );
}
