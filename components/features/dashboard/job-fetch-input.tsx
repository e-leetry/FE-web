"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface JobFetchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onFetch?: () => void;
  placeholder?: string;
  className?: string;
}

export function JobFetchInput({
  value,
  onChange,
  onFetch,
  placeholder = "원티드, 잡코리아 등 채용공고 주소를 입력해요",
  className,
}: JobFetchInputProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between w-full h-[88px] pl-5 pr-2.5 rounded-[12px] border-2 border-[#eee] bg-white overflow-hidden",
        className
      )}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-lg font-medium placeholder:text-[#c5c5c5] leading-[1.5] tracking-[-0.36px] font-['Pretendard']"
      />
      <button
        onClick={onFetch}
        className="flex items-center justify-center h-11 px-2.5 gap-1 rounded-[12px] border-[1.5px] border-[#eee] bg-white transition-colors hover:bg-slate-50 active:bg-slate-100 shrink-0"
      >
        <Image
          src="/images/icon/ico_fetch.svg"
          alt="fetch"
          width={23}
          height={23}
        />
        <span className="text-sm font-medium text-[#5c646f] tracking-[-0.28px] font-['Pretendard']">
          공고 불러오기
        </span>
      </button>
    </div>
  );
}
