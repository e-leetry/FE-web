"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Image from "next/image";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface JobCardProps {
  id?: string | number;
  type?: "default" | "loading" | "add";
  size?: "M" | "S";
  companyName?: string;
  title?: string;
  deadline?: string;
  /** 채용공고 원본 URL */
  url?: string;
  className?: string;
  onClick?: () => void;
  /** DragOverlay 등에서 사용할 때 true로 설정 */
  isOverlay?: boolean;
}

const formatDeadline = (deadline?: string) => {
  if (!deadline) return "";

  const digitsOnly = deadline.replace(/[^0-9]/g, "");

  if (digitsOnly.length < 6) {
    return deadline.trim();
  }

  const normalized = digitsOnly.length >= 8 ? digitsOnly.slice(-8) : digitsOnly.slice(-6);

  const year = normalized.length === 8 ? normalized.slice(2, 4) : normalized.slice(0, 2);
  const month = normalized.length === 8 ? normalized.slice(4, 6) : normalized.slice(2, 4);
  const day = normalized.length === 8 ? normalized.slice(6, 8) : normalized.slice(4, 6);

  if (!year || !month || !day) {
    return deadline.trim();
  }

  return `${year}. ${month.padStart(2, "0")}. ${day.padStart(2, "0")}`;
};

export function JobCard({
  id,
  type = "default",
  size = "M",
  companyName,
  title,
  deadline,
  url,
  className,
  onClick,
  isOverlay = false
}: JobCardProps) {
  const fallbackId = useId();
  const sortableId = id ?? fallbackId;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sortableId,
    disabled: isOverlay
  });

  const formattedDeadline = formatDeadline(deadline);

  const style = isOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 0 : undefined
      };

  // type=add 카드
  if (type === "add") {
    return (
      <Card
        onClick={onClick}
        className={cn(
          "flex shrink-0 cursor-pointer flex-row items-center justify-center gap-2 rounded-[16px] border-[1.5px] border-dashed border-[#DDDDDD] bg-transparent p-[16px_20px] shadow-[0px_2px_8px_rgba(0,0,0,0.05)] hover:bg-slate-50",
          "w-[180px] min-[1440px]:w-[224px]",
          size === "M" ? "h-[144px]" : "h-[80px]",
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

  // type=loading 카드
  if (type === "loading") {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={onClick}
        className={cn(
          "flex shrink-0 cursor-pointer flex-col rounded-[16px] bg-white p-[16px_20px] shadow-[0px_2px_8px_rgba(0,0,0,0.05)]",
          "w-[180px] min-[1440px]:w-[224px]",
          size === "M" ? "h-[144px] justify-between" : "h-[80px] justify-between",
          className
        )}
      >
        {/* 회사명 영역 */}
        <div className="flex flex-1 flex-col gap-[8px]">
          <span className="text-[16px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#3E3E3E]">
            {companyName}
          </span>
        </div>

        {/* 로딩 상태 표시 */}
        <div className="flex items-center">
          <Image
            src="/images/dashboard/ico_ai.svg"
            alt="AI"
            width={24}
            height={24}
            className="animate-pulse"
          />
          <span className="text-[14px] font-normal leading-[1.19] tracking-[-0.02em] text-[#9E9E9E]">
            불러오는 중
          </span>
        </div>
      </Card>
    );
  }

  // type=default 카드
  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "relative flex shrink-0 cursor-pointer flex-col rounded-[16px] bg-white p-[16px_20px] shadow-[0px_2px_8px_rgba(0,0,0,0.05)]",
        "w-[180px] min-[1440px]:w-[224px]",
        size === "M" ? "h-[144px] justify-between gap-[16px]" : "gap-[4px]",
        className
      )}
    >
      {/* 회사명 & 직무명 영역 */}
      <div className="flex flex-col gap-[4px]">
        <span className="text-[16px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#3E3E3E]">
          {companyName}
        </span>
        <span
          className={cn(
            "text-[13px] font-medium leading-[1.5] tracking-[-0.02em] text-[#5C5C5C]",
            size === "S" && "line-clamp-1"
          )}
        >
          {title}
        </span>
      </div>

      {/* 공고 바로가기 버튼 (absolute 위치) */}
      {url && (
        <button
          className="absolute right-[12px] top-[12px] p-1 hover:bg-gray-100 rounded transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            window.open(url, "_blank", "noopener,noreferrer");
          }}
          aria-label="채용공고 바로가기"
        >
          <Image
            src="/images/dashboard/ico_more.svg"
            alt="More"
            width={16}
            height={16}
            className="transition-opacity group-hover:opacity-100"
          />
        </button>
      )}

      {/* 마감일 - size=M일 때만 표시 */}
      {size === "M" && formattedDeadline && (
        <div className="flex items-center gap-[8px]">
          <span className="text-[14px] font-normal leading-[1.19] tracking-[-0.02em] text-[#9E9E9E]">
            -{formattedDeadline} 까지
          </span>
        </div>
      )}
    </Card>
  );
}
