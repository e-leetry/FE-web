"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TooltipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  showTail?: boolean;
}

export function TooltipButton({
  label,
  showTail = true,
  className,
  onClick,
  ...props
}: TooltipButtonProps) {
  return (
    <div
      className={cn(
        "relative bg-[#2B2B2B] text-white w-[200px] h-[69px] rounded-[20px] flex items-center justify-between px-6 shadow-lg",
        className
      )}
    >
      <span className="text-[16px] font-bold tracking-[-0.02em] leading-[1.2] whitespace-nowrap">
        {label}
      </span>
      <div className="bg-[#F9F9F9] rounded-full w-[20px] h-[20px] flex items-center justify-center">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 0V8M0 4H8" stroke="#2B2B2B" strokeWidth="2" />
        </svg>
      </div>

      {showTail && (
        <div className="absolute -bottom-[11px] left-1/2 -translate-x-1/2">
          <svg
            width="36"
            height="21"
            viewBox="0 0 36 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5413 18.9174C16.8837 20.6955 19.1163 20.6955 20.4587 18.9174L35.25 0.75H0.75L15.5413 18.9174Z"
              fill="#2B2B2B"
            />
          </svg>
        </div>
      )}

      <button
        onClick={onClick}
        className="absolute inset-0 w-full h-full rounded-[20px] focus:outline-none"
        aria-label={label}
        {...props}
      />
    </div>
  );
}
