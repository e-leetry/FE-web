"use client";

import { DimOverlay } from "@/components/ui/dim-overlay";
import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";

/**
 * 모달 베이스 컴포넌트 Props
 */
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  /** 왼쪽 메뉴 영역 (선택사항) */
  sidebar?: React.ReactNode;
  /** 중앙 콘텐츠 영역 */
  children: React.ReactNode;
  /** 하단 액션 영역 (버튼 등) */
  footer?: React.ReactNode;
  /** 모달 너비 (기본값: 1000px) */
  width?: string;
  /** 모달 높이 (기본값: 720px) */
  height?: string;
  /** 추가 클래스 */
  className?: string;
}

/**
 * 다양한 모달에서 공통적으로 사용할 수 있는 베이스 컴포넌트
 */
export const BaseModal = ({
  isOpen,
  onClose,
  title,
  sidebar,
  children,
  footer,
  width = "1000px",
  height = "720px",
  className
}: BaseModalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setIsScrolled(scrollRef.current.scrollTop > 0);
      }
    };

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 공통 스타일 클래스 추출
  const modalContainerClass = cn(
    "relative z-10 flex bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[0px_20px_40px_rgba(0,0,0,0.1)]",
    className
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {/* 배경 딤 처리 및 클릭 시 닫기 */}
      <DimOverlay onClick={onClose} position="fixed" />

      {/* 모달 본체 */}
      <div
        className={modalContainerClass}
        style={{ 
          width: "100%", 
          height: "100%", 
          maxWidth: width, 
          maxHeight: height 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 왼쪽 사이드바 영역 (존재할 경우에만 렌더링) */}
        {sidebar && (
          <div className="hidden sm:flex w-[104px] bg-[#FAFAFA] border-r border-[#EEEEEE] flex-col items-center py-8 gap-4">
            {sidebar}
          </div>
        )}

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* 스크롤 가능한 콘텐츠 */}
          <div ref={scrollRef} className="flex-1 p-6 md:p-10 overflow-y-auto">
            {/* 제목 영역 */}
            <div className="mb-6 md:mb-10">
              {typeof title === "string" ? (
                <h2 className="text-[24px] md:text-[32px] font-bold text-[#282828]">{title}</h2>
              ) : (
                title
              )}
            </div>

            {/* 내용 */}
            {children}
            {/* 하단 여백 확보 (푸터가 콘텐츠를 가리지 않게) */}
            {footer && <div className="h-20" />}
          </div>

          {/* 하단 푸터 영역 (존재할 경우에만 렌더링) */}
          {footer && (
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 px-6 md:px-[48px] pb-6 md:pb-[32px] pt-10 flex items-center justify-end",
                "bg-gradient-to-t from-white from-[57%] to-transparent"
              )}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
