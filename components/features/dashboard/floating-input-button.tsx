"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TooltipButton } from "@/components/shared/tooltip-button";

interface FloatingInputButtonProps {
  /** 버튼 라벨 (기본 상태) */
  buttonLabel?: string;
  /** 인풋 placeholder */
  placeholder?: string;
  /** 제출 버튼 라벨 */
  submitLabel?: string;
  /** 제출 핸들러 */
  onSubmit?: (value: string) => void;
  /** 버튼 클릭 핸들러 (인풋 모드 전환 전) */
  onButtonClick?: () => void;
  /** 외부에서 열림 상태 제어 */
  isOpen?: boolean;
  /** 열림 상태 변경 핸들러 */
  onOpenChange?: (open: boolean) => void;
  /** 로딩 상태 */
  isLoading?: boolean;
  className?: string;
}

export function FloatingInputButton({
  buttonLabel = "채용공고 등록하기",
  placeholder = "채용공고의 링크를 입력해주세요",
  submitLabel = "등록하기",
  onSubmit,
  onButtonClick,
  isOpen: controlledIsOpen,
  onOpenChange,
  isLoading = false,
  className
}: FloatingInputButtonProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledIsOpen ?? internalIsOpen;
  const setIsOpen = (open: boolean) => {
    setInternalIsOpen(open);
    onOpenChange?.(open);
  };

  const handleButtonClick = () => {
    onButtonClick?.();
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (inputValue.trim() && !isLoading) {
      // URL 형식 검증
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

      if (!urlPattern.test(inputValue.trim())) {
        setIsInvalid(true);
        setInputValue("");
        return;
      }

      setIsInvalid(false);
      onSubmit?.(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setInputValue("");
    }
  };

  // 인풋 모드로 전환 시 자동 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen && !inputValue.trim()) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, inputValue]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center",
        className
      )}
    >
      {!isOpen ? (
        // 버튼 상태 (Default)
        <TooltipButton label={buttonLabel} onClick={handleButtonClick} />
      ) : (
        // 인풋 상태 (Variant2)
        <div className="relative">
          <div
            className={cn(
              "bg-white w-[560px] rounded-[16px] flex items-center gap-4 px-5 py-[15px] transition-all duration-300",
              isInvalid && "animate-shake border-2 border-[#F05552]"
            )}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsInvalid(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder={isInvalid ? "올바른 형식의 링크를 입력해주세요" : placeholder}
              className={cn(
                "flex-1 text-[16px] font-medium leading-[1.5] tracking-[-0.02em] text-[#2B2B2B] outline-none bg-transparent",
                isInvalid ? "placeholder:text-[#F05552]" : "placeholder:text-[#9E9E9E]"
              )}
              disabled={isLoading}
            />
            {/* 등록 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                "w-[80px] h-[40px] rounded-[12px] text-[16px] font-medium text-white transition-colors",
                inputValue.trim() && !isLoading
                  ? "bg-[#2B2B2B] hover:bg-[#3B3B3B]"
                  : "bg-[#CCCCCC] cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
