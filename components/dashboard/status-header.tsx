"use client";

import { cn } from "@/lib/utils";

interface StatusHeaderProps {
  title: string;
  count: number;
  className?: string;
}

export function StatusHeader({ title, count, className }: StatusHeaderProps) {
  return (
    <div className={cn("flex items-center gap-2 px-1 py-2", className)}>
      <span className="text-[16px] font-bold text-[#1F2937]">{title}</span>
      <div className="flex h-[20px] min-w-[20px] items-center justify-center rounded-[6px] bg-[#1F2937] px-1.5">
        <span className="text-[12px] font-bold text-white">{count}</span>
      </div>
    </div>
  );
}
