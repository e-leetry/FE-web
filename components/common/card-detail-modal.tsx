"use client";

import { DimOverlay } from "@/components/ui/dim-overlay";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { FormDatePicker } from "./form-date-picker";
import { FormTextArea } from "./form-text-area";
import { FormInput } from "./form-input";

const cardDetailSchema = z.object({
  process: z.string().min(1, "채용과정을 입력해주세요"),
  deadline: z.string().min(1, "마감일을 선택해주세요"),
  mainTasks: z.string().optional(),
  qualifications: z.string().optional(),
  preferences: z.string().optional()
});

type CardDetailValues = z.infer<typeof cardDetailSchema>;

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Figma 노드 325:6614를 기반으로 재구현한 카드 상세 모달 컴포넌트
 */
export const CardDetailModal = ({ isOpen, onClose }: CardDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<"info" | "memo">("info");

  const form = useForm<CardDetailValues>({
    resolver: zodResolver(cardDetailSchema),
    defaultValues: {
      process: "",
      deadline: "",
      mainTasks: "",
      qualifications: "",
      preferences: ""
    }
  });

  const onSubmit = (values: CardDetailValues) => {
    // API 요청 로직이 들어갈 자리
    console.log("폼 제출 데이터:", values);
  };

  if (!isOpen) return null;

  // 공통 CSS 클래스 및 스타일 추출 (가이드라인 준수)
  const colors = {
    primary: "#282828",
    secondary: "#727272",
    border: "#EEEEEE",
    bgLight: "#FAFAFA",
    bgActive: "#F3F3F3",
    placeholder: "#BDBDBD"
  };

  const navItemBaseClass =
    "flex flex-col items-center justify-center w-[72px] h-[72px] rounded-[12px] cursor-pointer transition-colors gap-1";
  const activeNavItemClass = "bg-[#F3F3F3] text-[#282828] font-bold";
  const inactiveNavItemClass = "text-[#727272] hover:bg-[#F3F3F3]/50";

  const labelClass = "text-[16px] font-bold text-[#282828] mb-3 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 딤 처리 및 클릭 시 닫기 */}
      <DimOverlay onClick={onClose} position="fixed" />

      {/* 모달 본체 */}
      <div
        className="relative z-10 flex w-[1000px] h-[720px] bg-white rounded-[32px] overflow-hidden shadow-[0px_20px_40px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 왼쪽 네비게이션 (이미지 기준 수직 배치) */}
        <div className="w-[104px] bg-[#FAFAFA] border-r border-[#EEEEEE] flex flex-col items-center py-8 gap-4">
          <div
            className={cn(
              navItemBaseClass,
              activeTab === "info" ? activeNavItemClass : inactiveNavItemClass
            )}
            onClick={() => setActiveTab("info")}
          >
            <div className="relative w-6 h-6">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 7H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 17H12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[12px]">채용정보</span>
          </div>

          <div
            className={cn(
              navItemBaseClass,
              activeTab === "memo" ? activeNavItemClass : inactiveNavItemClass
            )}
            onClick={() => setActiveTab("memo")}
          >
            <div className="relative w-6 h-6">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 4H4V20H18V13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[12px]">개인메모</span>
          </div>
        </div>

        {/* 오른쪽 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-1 p-10 overflow-y-auto">
                {/* 타이틀 영역 */}
                <div className="mb-10">
                  <h2 className="text-[32px] font-bold text-[#282828]">엔카닷컴</h2>
                </div>

                {/* 폼 영역 (이미지 기준 레이아웃 수정) */}
                <div className="flex flex-col gap-8">
                  {/* 채용과정 & 마감일 한 줄 배치 */}
                  <div className="flex gap-4">
                    <FormInput
                      control={form.control}
                      name="process"
                      label="채용과정"
                      className="flex-1"
                      labelClassName={labelClass}
                      placeholder="(예시) 서류제출 -> 1차합격 -> 2차합격 -> 최종합격"
                    />
                    <FormDatePicker
                      control={form.control}
                      name="deadline"
                      label="마감일"
                      labelClassName={labelClass}
                    />
                  </div>

                  {/* 주요업무 */}
                  <FormTextArea
                    control={form.control}
                    name="mainTasks"
                    label="주요업무"
                    labelClassName={labelClass}
                    placeholder="(예시) 전사의 핵심 성과 지표를 정의하고 개선"
                  />

                  {/* 자격요건 */}
                  <FormTextArea
                    control={form.control}
                    name="qualifications"
                    label="자격요건"
                    labelClassName={labelClass}
                    placeholder="(예시) 다양한 조직과 협업하는 걸 좋아하시는 분"
                  />

                  {/* 우대사항 */}
                  <FormTextArea
                    control={form.control}
                    name="preferences"
                    label="우대사항"
                    labelClassName={labelClass}
                    placeholder="(예시) 부서간 이해관계 조정했던 경험이 있으신 분"
                  />
                </div>
              </div>

              {/* 하단 액션 영역 (이미지 기준 추가) */}
              <div className="p-6 px-10 border-t border-[#EEEEEE] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2 text-[#727272] text-[15px]">
                  <Image
                    src="/images/dashboard/ico_loading.svg"
                    alt="loading"
                    width={20}
                    height={20}
                    className="animate-spin"
                  />
                  <span>공고 불러오는 중</span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-4 bg-[#F3F3F3] text-[#282828] font-bold rounded-[12px] hover:bg-[#EAEAEA] transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-[#282828] text-white font-bold rounded-[12px] hover:bg-[#000000] transition-colors"
                  >
                    저장하기
                  </button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
