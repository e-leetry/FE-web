"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Control, UseFormSetValue, useWatch, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dayjs from "dayjs";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FormTextArea } from "./form-text-area";
import { BaseModal } from "./base-modal";
import { FormInput } from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  useCreate,
  useUpdate,
  useGetById
} from "@/lib/api/generated/job-posting-summary/job-posting-summary";
import { getGetDashboardsQueryKey } from "@/lib/api/generated/dashboard/dashboard";
import {
  JobPostingSummaryCreateRequestPlatform,
  JobPostingSummaryUpdateRequestPlatform
} from "@/lib/api/generated/model";

const cardDetailSchema = z.object({
  companyName: z.string().min(1, "기업명을 입력해주세요"),
  jobTitle: z.string().min(1, "직무명을 입력해주세요"),
  jobUrl: z.string().url("올바른 URL 형식이 아닙니다").or(z.literal("")),
  process: z.string().min(1, "채용과정을 입력해주세요").or(z.literal("")),
  deadline: z.string()
    .min(1, "마감일을 입력해주세요")
    .refine((val) => dayjs(val).isValid(), {
      message: "유효한 날짜 형식이 아닙니다 (예: 2024-12-31)"
    }),
  mainTasks: z.string().optional(),
  qualifications: z.string().optional(),
  preferences: z.string().optional(),
  memo: z.string().optional()
});

type CardDetailValues = z.infer<typeof cardDetailSchema>;

interface RecruitmentInfoFormProps {
  control: Control<CardDetailValues>;
  setValue: UseFormSetValue<CardDetailValues>;
  labelClass: string;
  isEdit?: boolean;
  onSummarize?: () => void;
  isSummarizing?: boolean;
}

const RecruitmentInfoForm = ({
  control,
  setValue,
  labelClass,
  isEdit = false,
  onSummarize,
  isSummarizing
}: RecruitmentInfoFormProps) => {
  const companyName = useWatch({ control, name: "companyName" });
  const jobTitle = useWatch({ control, name: "jobTitle" });

  return (
    <div className="flex flex-col gap-6">
      {isEdit ? (
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-4">
            <span className="text-[28px] font-semibold text-[#343e4c]">
              {companyName || "기업명"}
            </span>
            <div className="w-[2px] h-4 bg-[#eee]" />
            <span className="text-[28px] font-normal text-[#343e4c]">
              {jobTitle || "직무명"}
            </span>
          </div>
          <button type="button" className="p-3 bg-[#eee] rounded-[6px] shrink-0">
            <div className="relative w-3 h-3">
              <Image src="/images/icon/ico_write_on.svg" alt="edit" fill />
            </div>
          </button>
        </div>
      ) : (
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
      )}

      <div className="flex flex-col gap-[8px]">
        <div className="flex justify-between items-end">
          <label className={labelClass}>채용링크</label>
        </div>
        <div className="flex gap-2">
          <FormInput
            control={control}
            name="jobUrl"
            label=""
            className="flex-1"
            labelClassName="hidden"
            placeholder="원티드, 잡코리아 등 채용공고 주소를 입력해요"
          />
          {isEdit && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-[64px] rounded-[12px] border-2 border-[#eee] text-[#5c646f] font-medium gap-1 px-4"
              onClick={onSummarize}
              disabled={isSummarizing}
            >
              <div className="relative w-5 h-5">
                <Image src="/images/icon/ico_link.svg" alt="link" fill />
              </div>
              {isSummarizing ? "불러오는 중..." : "공고 불러오기"}
            </Button>
          )}
        </div>
      </div>

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
        autoResize
      />

      <FormTextArea
        control={control}
        name="qualifications"
        label="자격요건"
        labelClassName={labelClass}
        placeholder="(예시) 다양한 조직과 협업하는 걸 좋아하시는 분"
        rows={1}
        autoResize
      />

      <FormTextArea
        control={control}
        name="preferences"
        label="우대사항"
        labelClassName={labelClass}
        placeholder="(예시) 부서간 이해관계 조정했던 경험이 있으신 분"
        rows={1}
        autoResize
      />
    </div>
  );
};

interface PersonalMemoFormProps {
  control: Control<CardDetailValues>;
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
      autoResize
    />
  </div>
);

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  dashboardId?: number;
  jobPostingId?: number;
  initialData?: any;
}

export const CardDetailModal = ({
  isOpen,
  onClose,
  dashboardId,
  jobPostingId,
  initialData
}: CardDetailModalProps) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"info" | "memo">("info");
  const { mutate: createSummary, isPending: isCreating } = useCreate();
  const { mutate: updateSummary, isPending: isUpdating } = useUpdate();

  const { data: jobPostingData, isLoading: isFetching, refetch: summarize, isRefetching: isSummarizing } = useGetById(jobPostingId as number, {
    query: {
      enabled: !!jobPostingId && isOpen
    }
  });

  const isEdit = !!jobPostingId;

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

  const companyName = useWatch({ control: form.control, name: "companyName" });

  const handleSummarize = () => {
    if (!jobPostingId) return;
    summarize();
  };

  useEffect(() => {
    if (!isOpen) return;

    // 린트 에러를 방지하기 위해 비동기적으로 상태 업데이트
    const timer = setTimeout(() => {
      setActiveTab("info");
    }, 0);
    
    const dataToUse = jobPostingData || initialData;

    if (isEdit && dataToUse) {
      // initialData 또는 jobPostingData를 기반으로 폼 초기화
      let parsedContent = {
        process: "",
        mainTasks: "",
        qualifications: "",
        preferences: ""
      };

      if (dataToUse.contentJson) {
        parsedContent = dataToUse.contentJson as any;
      }

      form.reset({
        companyName: dataToUse.companyName || "",
        jobTitle: dataToUse.title || "",
        jobUrl: dataToUse.url || "",
        process: parsedContent.process || "",
        deadline: dataToUse.deadline || "",
        mainTasks: parsedContent.mainTasks || "",
        qualifications: parsedContent.qualifications || "",
        preferences: parsedContent.preferences || "",
        memo: dataToUse.memo || ""
      });
    } else if (!isEdit) {
      form.reset({
        companyName: "",
        jobTitle: "",
        jobUrl: "",
        process: "",
        deadline: "",
        mainTasks: "",
        qualifications: "",
        preferences: "",
        memo: ""
      });
    }

    return () => clearTimeout(timer);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isOpen && isEdit && (jobPostingData || initialData)) {
      const dataToUse = jobPostingData || initialData;
      let parsedContent = {
        process: "",
        mainTasks: "",
        qualifications: "",
        preferences: ""
      };

      if (dataToUse.contentJson) {
        parsedContent = dataToUse.contentJson as any;
      }

      form.reset({
        companyName: dataToUse.companyName || "",
        jobTitle: dataToUse.title || "",
        jobUrl: dataToUse.url || "",
        process: parsedContent.process || "",
        deadline: dataToUse.deadline || "",
        mainTasks: parsedContent.mainTasks || "",
        qualifications: parsedContent.qualifications || "",
        preferences: parsedContent.preferences || "",
        memo: dataToUse.memo || ""
      });
    }
  }, [jobPostingData, initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (values: CardDetailValues) => {
    const contentJson = {
      process: values.process,
      mainTasks: values.mainTasks,
      qualifications: values.qualifications,
      preferences: values.preferences
    };

    if (isEdit && jobPostingId) {
      updateSummary(
        {
          id: jobPostingId,
          data: {
            title: values.jobTitle,
            companyName: values.companyName,
            url: values.jobUrl,
            deadline: values.deadline,
            platform: JobPostingSummaryUpdateRequestPlatform.UNKNOWN,
            contentJson: contentJson,
            memo: values.memo
          }
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetDashboardsQueryKey() });
            handleClose();
          },
          onError: (error) => {
            console.error("채용 공고 요약 수정 실패:", error);
          }
        }
      );
    } else {
      if (dashboardId === undefined) {
        console.error("dashboardId is required to create a job posting summary");
        return;
      }

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
            queryClient.invalidateQueries({ queryKey: getGetDashboardsQueryKey() });
            handleClose();
          },
          onError: (error) => {
            console.error("채용 공고 요약 등록 실패:", error);
          }
        }
      );
    }
  };

  if (!isOpen) return null;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const labelClass = "text-[16px] font-bold text-[#727272] mb-[12px] block";

  const isPending = isCreating || isUpdating || isFetching;

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
            disabled={isPending}
            onClick={handleClose}
            className="flex-1 sm:flex-none"
          >
            닫기
          </Button>
          <Button
            type="submit"
            color="primary"
            size="xl"
            disabled={isPending}
            form="card-detail-form"
            className="flex-1 sm:flex-none"
          >
            {isPending ? (isFetching ? "로딩 중..." : "저장 중...") : "저장하기"}
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
              isEdit={isEdit}
              onSummarize={handleSummarize}
              isSummarizing={isSummarizing}
            />
          ) : (
            <>
              {isEdit && (
                <div className="text-[32px] font-bold text-[#282828] mb-10">
                  {companyName || "기업명"}
                </div>
              )}
              <PersonalMemoForm control={form.control} labelClass={labelClass} />
            </>
          )}
        </form>
      </Form>
    </BaseModal>
  );
};




