"use client";

import { cn } from "@/lib/utils";

interface StatusHeaderProps {
  title: string;
  count: number;
  className?: string;
}

export function StatusHeader({ title, count, className }: StatusHeaderProps) {
  return (
    <div className={cn("flex items-center gap-[8px]", className)}>
      <span className="text-[18px] font-[700] leading-[21.48px] tracking-[-0.36px] text-[#343E4C]">{title}</span>
      <div className="flex h-[20px] min-w-[20px] items-center justify-center rounded-[6px] bg-[#EE6D68] px-1.5">
        <span className="text-[14px] font-[700] leading-[14px] tracking-[-0.28px] text-white">{count}</span>
      </div>
    </div>
  );
}
