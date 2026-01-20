"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FormTextArea } from "./form-text-area";
import { BaseModal } from "./base-modal";
import { FormInput } from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { useCreate } from "@/lib/api/generated/job-posting-summary/job-posting-summary";
import { JobPostingSummaryCreateRequestPlatform } from "@/lib/api/generated/model";

const cardDetailSchema = z.object({
  companyName: z.string().min(1, "기업명을 입력해주세요"),
  jobTitle: z.string().min(1, "직무명을 입력해주세요"),
  jobUrl: z.string().url("올바른 URL 형식이 아닙니다").or(z.literal("")),
  process: z.string().min(1, "채용과정을 입력해주세요"),
  deadline: z.string().min(1, "마감일을 입력해주세요"),
  mainTasks: z.string().optional(),
  qualifications: z.string().optional(),
  preferences: z.string().optional(),
  memo: z.string().optional()
});

type CardDetailValues = z.infer<typeof cardDetailSchema>;

interface RecruitmentInfoFormProps {
  control: any;
  setValue: any;
  labelClass: string;
}

const RecruitmentInfoForm = ({ control, setValue, labelClass }: RecruitmentInfoFormProps) => (
  <div className="flex flex-col gap-6">
    <div className="flex gap-4">
      <FormInput
        control={control}
        name="companyName"
        label="기업명"
        className="flex-1"
        labelClassName={labelClass}
        placeholder="기업명을 입력해요"
      />
      <FormInput
        control={control}
        name="jobTitle"
        label="직무명"
        className="flex-1"
        labelClassName={labelClass}
        placeholder="지원하는 직무를 입력해요"
      />
    </div>

    <FormInput
      control={control}
      name="jobUrl"
      label="채용링크"
      labelClassName={labelClass}
      placeholder="원티드, 잡코리아 등 채용공고 주소를 입력해요"
    />

    <div className="flex gap-4">
      <FormInput
        control={control}
        name="process"
        label="채용과정"
        className="flex-[2]"
        labelClassName={labelClass}
        placeholder="(예시) 서류제출 -> 1차합격 -> 2차합격 -> 최종합격"
      />
      <FormInput
        control={control}
        name="deadline"
        label="마감일"
        className="flex-1"
        labelClassName={labelClass}
        placeholder="YYYY-MM-DD"
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/g, "");
          let formattedValue = value;
          if (value.length > 4) {
            formattedValue = `${value.slice(0, 4)}-${value.slice(4)}`;
          }
          if (value.length > 6) {
            formattedValue = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
          }
          setValue("deadline", formattedValue);
        }}
      />
    </div>

    <FormTextArea
      control={control}
      name="mainTasks"
      label="주요업무"
      labelClassName={labelClass}
      placeholder="(예시) 전사의 핵심 성과 지표를 정의하고 개선"
      rows={1}
    />

    <FormTextArea
      control={control}
      name="qualifications"
      label="자격요건"
      labelClassName={labelClass}
      placeholder="(예시) 다양한 조직과 협업하는 걸 좋아하시는 분"
      rows={1}
    />

    <FormTextArea
      control={control}
      name="preferences"
      label="우대사항"
      labelClassName={labelClass}
      placeholder="(예시) 부서간 이해관계 조정했던 경험이 있으신 분"
      rows={1}
    />
  </div>
);

interface PersonalMemoFormProps {
  control: any;
  labelClass: string;
}

const PersonalMemoForm = ({ control, labelClass }: PersonalMemoFormProps) => (
  <div className="flex flex-col gap-6">
    <FormTextArea
      control={control}
      name="memo"
      label="개인 메모"
      labelClassName={labelClass}
      placeholder="메모를 입력해주세요"
      rows={10}
    />
  </div>
);

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  dashboardId?: number;
}

/**
 * Figma 노드 325:6614를 기반으로 재구현한 카드 상세 모달 컴포넌트
 */
export const CardDetailModal = ({ isOpen, onClose, dashboardId }: CardDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<"info" | "memo">("info");
  const { mutate: createSummary, isPending: isCreating } = useCreate();

  const form = useForm<CardDetailValues>({
    resolver: zodResolver(cardDetailSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      jobUrl: "",
      process: "",
      deadline: "",
      mainTasks: "",
      qualifications: "",
      preferences: "",
      memo: ""
    }
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
      setActiveTab("info");
    }
  }, [isOpen, form.reset]);

  const onSubmit = (values: CardDetailValues) => {
    if (dashboardId === undefined) {
      console.error("dashboardId is required to create a job posting summary");
      return;
    }

    const contentJson = JSON.stringify({
      process: values.process,
      mainTasks: values.mainTasks,
      qualifications: values.qualifications,
      preferences: values.preferences
    });

    createSummary(
      {
        data: {
          dashboardId: dashboardId,
          title: values.jobTitle,
          companyName: values.companyName,
          url: values.jobUrl,
          deadline: values.deadline,
          platform: JobPostingSummaryCreateRequestPlatform.UNKNOWN,
          contentJson: contentJson,
          memo: values.memo
        }
      },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (error) => {
          console.error("채용 공고 요약 등록 실패:", error);
        }
      }
    );
  };

  if (!isOpen) return null;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const labelClass = "text-[16px] font-bold text-[#727272] mb-[12px] block";

  const navItemBaseClass =
    "flex flex-col items-center justify-center w-[72px] h-[72px] rounded-[12px] cursor-pointer transition-colors gap-1";
  const activeNavItemClass = "bg-[#F3F3F3] text-[#282828] font-bold";
  const inactiveNavItemClass = "text-[#727272] hover:bg-[#F3F3F3]/50";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      sidebar={
        <>
          <div
            className={cn(
              navItemBaseClass,
              activeTab === "info" ? activeNavItemClass : inactiveNavItemClass
            )}
            onClick={() => setActiveTab("info")}
          >
            <div className="relative w-6 h-6">
              <Image
                src={
                  activeTab === "info"
                    ? "/images/icon/ico_document_on.svg"
                    : "/images/icon/ico_document_off.svg"
                }
                alt="채용정보"
                fill
              />
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
              <Image
                src={
                  activeTab === "memo"
                    ? "/images/icon/ico_write_on.svg"
                    : "/images/icon/ico_write_off.svg"
                }
                alt="개인메모"
                fill
              />
            </div>
            <span className="text-[12px]">개인메모</span>
          </div>
        </>
      }
      footer={
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button
            type="button"
            color="neutral"
            size="xl"
            disabled={isCreating}
            onClick={handleClose}
            className="flex-1 sm:flex-none"
          >
            닫기
          </Button>
          <Button
            type="submit"
            color="primary"
            size="xl"
            disabled={isCreating}
            form="card-detail-form"
            className="flex-1 sm:flex-none"
          >
            {isCreating ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form
          id="card-detail-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col"
        >
          {activeTab === "info" ? (
            <RecruitmentInfoForm
              control={form.control}
              setValue={form.setValue}
              labelClass={labelClass}
            />
          ) : (
            <>
              <div className="text-[32px] font-bold text-[#282828] mb-10">
                {form.watch("companyName") || "기업명"}
              </div>
              <PersonalMemoForm control={form.control} labelClass={labelClass} />
            </>
          )}
        </form>
      </Form>
    </BaseModal>
  );
};
