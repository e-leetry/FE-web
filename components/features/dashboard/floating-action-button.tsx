"use client";

import React from "react";
import { TooltipButton } from "@/components/shared/tooltip-button";

interface FloatingActionButtonProps {
  onClick?: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      <TooltipButton label="채용공고 등록하기" onClick={onClick} />
    </div>
  );
}
