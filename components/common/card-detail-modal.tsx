"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode, startTransition, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Control, UseFormSetValue, useWatch, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dayjs from "dayjs";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormTextArea } from "./form-text-area";
import { BaseModal } from "./base-modal";
import { FormInput } from "@/components/common/form-input";
import { CardDetailFooter, CardDetailFooterProps } from "@/components/common/card-detail-footer";
import {
  useCreate,
  useUpdate,
  useGetById,
  useDelete,
  useRename,
  useUndo,
  getGetByIdQueryKey
} from "@/lib/api/generated/job-posting-summary/job-posting-summary";
import { getGetDashboardsQueryKey } from "@/lib/api/generated/dashboard/dashboard";
import {
  DashboardResponse,
  JobPostingSummaryCreateRequestPlatform,
  JobPostingSummaryUpdateRequestPlatform
} from "@/lib/api/generated/model";
import { SseStreamingData, useJobSummarizeSse } from "@/lib/hooks/use-job-summarize-sse";
import { LocalJob } from "@/lib/hooks/use-local-dashboard";
import { showToast } from "@/store/ui/toast-store";

const cardDetailSchema = z.object({
  companyName: z.string().min(1, "기업명을 입력해주세요"),
  jobTitle: z.string().min(1, "직무명을 입력해주세요"),
  jobUrl: z.string().url("올바른 URL 형식이 아닙니다").or(z.literal("")),
  process: z.string().min(1, "채용과정을 입력해주세요").or(z.literal("")),
  deadline: z.string().refine((val) => val === "" || dayjs(val).isValid(), {
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
  isNameEditMode?: boolean;
  onSummarize?: () => void;
  isSummarizing?: boolean;
  disabled?: boolean;
  onStartNameEdit?: () => void;
  onCancelNameEdit?: () => void;
  onConfirmNameEdit?: () => void | Promise<void>;
  isRenaming?: boolean;
}

const RecruitmentInfoForm = ({
  control,
  setValue,
  labelClass,
  isEdit = false,
  isNameEditMode = false,
  onSummarize,
  isSummarizing,
  disabled = false,
  onStartNameEdit,
  onCancelNameEdit,
  onConfirmNameEdit,
  isRenaming = false
}: RecruitmentInfoFormProps) => {
  const companyName = useWatch({ control, name: "companyName" });
  const jobTitle = useWatch({ control, name: "jobTitle" });

  return (
    <div className="flex flex-col gap-6">
      {isEdit && !isNameEditMode ? (
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-4">
            <span className="text-[28px] font-semibold text-[#343e4c]">
              {companyName || "기업명"}
            </span>
            <div className="w-[2px] h-4 bg-[#eee]" />
            <span className="text-[28px] font-normal text-[#343e4c]">{jobTitle || "직무명"}</span>
          </div>
          <button
            type="button"
            className="p-3 bg-[#eee] rounded-[6px] shrink-0 disabled:opacity-50"
            onClick={onStartNameEdit}
            disabled={disabled || !onStartNameEdit}
          >
            <div className="relative w-3 h-3">
              <Image src="/images/icon/ico_write_on.svg" alt="edit" fill />
            </div>
          </button>
        </div>
      ) : (
        <div className={cn("flex items-center gap-3", isEdit ? "mb-4" : "")}>
          <div className="flex gap-3 flex-1">
            <FormInput
              control={control}
              name="companyName"
              label=""
              className="flex-1 [&>label]:hidden"
              labelClassName="hidden"
              placeholder="기업명을 입력해요"
              disabled={disabled || isRenaming}
            />
            <FormInput
              control={control}
              name="jobTitle"
              label=""
              className="flex-1 [&>label]:hidden"
              labelClassName="hidden"
              placeholder="지원하는 직무를 입력해요"
              disabled={disabled || isRenaming}
            />
          </div>
          {isEdit && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outlined"
                size="md"
                className="rounded-[10px] px-5"
                onClick={onCancelNameEdit}
                disabled={isRenaming}
              >
                취소
              </Button>
              <Button
                type="button"
                size="md"
                className="rounded-[10px] px-5"
                onClick={onConfirmNameEdit}
                disabled={disabled || isRenaming}
                isLoading={isRenaming}
              >
                수정하기
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-[8px]">
        <div className="flex justify-between items-end">
          <label className={labelClass}>채용링크</label>
        </div>
        <FormInput
          control={control}
          name="jobUrl"
          label=""
          className="flex-1"
          labelClassName="hidden"
          placeholder="원티드, 잡코리아 등 채용공고 주소를 입력해요"
          disabled={disabled}
          rightElement={
            <div className="relative group">
              <Button
                type="button"
                variant="outline"
                size="md"
                className="h-[44px] rounded-[10px] border-[1.5px] border-[#eeeeee] text-[#5c646f] font-medium gap-1 px-4 shadow-[0px_1px_4px_rgba(0,0,0,0.04)]"
                onClick={onSummarize}
                disabled={isSummarizing || disabled}
              >
                <div className="relative w-[18px] h-[18px]">
                  <Image src="/images/icon/ico_ai.svg" alt="fetch" width={23} height={23} />
                </div>
                {"공고 불러오기"}
              </Button>

              <div className="pointer-events-none absolute left-1/2 bottom-full z-10 mb-2 -translate-x-1/2 flex flex-col items-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-150">
                <div className="flex items-center justify-center rounded-[8px] bg-[rgba(40,40,40,0.72)] backdrop-blur-[8px] shadow-[0px_2px_8px_rgba(0,0,0,0.05)] px-2 py-1.5">
                  <span className="text-[14px] font-medium leading-[1.1935] tracking-[-0.02em] text-white whitespace-nowrap">
                    불러오면 내용이 초기화돼요
                  </span>
                </div>
                <svg
                  width="16"
                  height="9"
                  viewBox="0 0 16 9"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[rgba(40,40,40,0.72)]"
                >
                  <path d="M0 0H16L8 9Z" fill="currentColor" />
                </svg>
              </div>
            </div>
          }
          rightPaddingClassName="pr-[180px]"
          rightElementClassName="right-3"
        />
      </div>

      <div className="flex gap-4">
        <FormInput
          control={control}
          name="process"
          label="채용과정"
          className="flex-[2]"
          labelClassName={labelClass}
          placeholder="(예시) 서류제출 -> 1차합격 -> 2차합격 -> 최종합격"
          disabled={disabled}
        />
        <FormInput
          control={control}
          name="deadline"
          label="마감일"
          className="flex-1"
          labelClassName={labelClass}
          placeholder="YYYY-MM-DD"
          disabled={disabled}
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
        disabled={disabled}
      />

      <FormTextArea
        control={control}
        name="qualifications"
        label="자격요건"
        labelClassName={labelClass}
        placeholder="(예시) 다양한 조직과 협업하는 걸 좋아하시는 분"
        rows={1}
        autoResize
        disabled={disabled}
      />

      <FormTextArea
        control={control}
        name="preferences"
        label="우대사항"
        labelClassName={labelClass}
        placeholder="(예시) 부서간 이해관계 조정했던 경험이 있으신 분"
        rows={1}
        autoResize
        disabled={disabled}
      />
    </div>
  );
};

interface PersonalMemoFormProps {
  control: Control<CardDetailValues>;
  labelClass: string;
  disabled?: boolean;
}

const PersonalMemoForm = ({ control, labelClass, disabled = false }: PersonalMemoFormProps) => (
  <div className="flex flex-col gap-6">
    <FormTextArea
      control={control}
      name="memo"
      label="개인 메모"
      labelClassName={labelClass}
      placeholder="메모를 입력해주세요"
      rows={10}
      autoResize
      disabled={disabled}
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
  sseData?: SseStreamingData;
  isLoggedIn?: boolean;
  onSaveToLocal?: (jobData: LocalJob) => void;
  onDeleteLocal?: (jobId: number) => void;
  footer?: ReactNode | ((props: CardDetailFooterProps) => ReactNode);
}

export const CardDetailModal = ({
  isOpen,
  onClose,
  dashboardId,
  jobPostingId,
  initialData,
  sseData,
  isLoggedIn = true,
  onSaveToLocal,
  onDeleteLocal,
  footer
}: CardDetailModalProps) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"info" | "memo">("info");
  const [isNameEditMode, setIsNameEditMode] = useState(false);
  const [nameSnapshot, setNameSnapshot] = useState<{ companyName: string; jobTitle: string } | null>(
    null
  );
  const { mutate: createSummary, isPending: isCreating } = useCreate();
  const { mutate: updateSummary, isPending: isUpdating } = useUpdate();
  const { mutate: deleteSummary, isPending: isDeleting } = useDelete();
  const { mutate: renameSummary, isPending: isRenaming } = useRename();
  const { mutate: undoSummary } = useUndo();

  const { data: jobPostingData, isLoading: isFetching } = useGetById(jobPostingId as number, {
    query: {
      // 로그인 사용자이고 SSE 모드가 아닐 때만 기존 데이터를 불러옴
      enabled: isLoggedIn && !!jobPostingId && isOpen && !sseData
    }
  });

  // 내부 SSE 훅 (공고 불러오기 버튼용)
  const {
    streamingData: internalSseData,
    startSummarize: startInternalSse,
    reset: resetInternalSse
  } = useJobSummarizeSse();

  const isSummarizing = internalSseData.isStreaming;

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
  const isGuestEditMode = !isLoggedIn && Boolean(initialData) && !sseData;
  const isEdit = isLoggedIn ? !!jobPostingId : isGuestEditMode;

  const effectiveJobId = jobPostingId ?? initialData?.id ?? sseData?.metadata?.jobId;
  const finalizeNameEdit = () => {
    setIsNameEditMode(false);
    setNameSnapshot(null);
  };

  const handleStartNameEdit = () => {
    if (!isEdit || isNameEditMode) {
      return;
    }

    setNameSnapshot({
      companyName: form.getValues("companyName"),
      jobTitle: form.getValues("jobTitle")
    });
    setIsNameEditMode(true);
  };

  const handleCancelNameEdit = () => {
    const snapshot = nameSnapshot;
    if (snapshot) {
      form.setValue("companyName", snapshot.companyName, { shouldDirty: false });
      form.setValue("jobTitle", snapshot.jobTitle, { shouldDirty: false });
    }
    finalizeNameEdit();
  };

  const handleConfirmNameEdit = async () => {
    if (!isNameEditMode || isRenaming) {
      return;
    }

    const isValid = await form.trigger(["companyName", "jobTitle"]);
    if (!isValid) {
      return;
    }

    if (!isLoggedIn || !jobPostingId) {
      finalizeNameEdit();
      return;
    }

    const companyNameValue = form.getValues("companyName");
    const jobTitleValue = form.getValues("jobTitle");

    renameSummary(
      {
        id: jobPostingId,
        data: {
          companyName: companyNameValue,
          title: jobTitleValue
        }
      },
      {
        onSuccess: () => {
          const detailQueryKey = getGetByIdQueryKey(jobPostingId);
          queryClient.setQueryData(detailQueryKey, (prev) =>
            prev
              ? {
                  ...prev,
                  companyName: companyNameValue,
                  title: jobTitleValue
                }
              : prev
          );
          queryClient.invalidateQueries({ queryKey: detailQueryKey });
          queryClient.invalidateQueries({ queryKey: getGetDashboardsQueryKey() });
          showToast({
            leftElement: "회사명과 공고명을 수정했어요"
          });
          finalizeNameEdit();
        },
        onError: (error) => {
          console.error("채용 공고 요약 기본 정보 수정 실패:", error);
          showToast({
            variant: "error",
            leftElement: "회사명과 공고명을 수정하지 못했어요"
          });
        }
      }
    );
  };

  const handleSummarize = () => {
    const jobUrl = form.getValues("jobUrl");
    if (!jobUrl) return;
    startInternalSse(jobUrl);
  };

  useEffect(() => {
    if (!isOpen) return;
    // SSE 모드에서는 기존 초기화 로직 건너뛰기
    if (sseData) return;

    // 린트 에러를 방지하기 위해 비동기적으로 상태 업데이트
    const timer = setTimeout(() => {
      setActiveTab("info");
    }, 0);

    const dataToUse = isLoggedIn ? jobPostingData || initialData : initialData;

    if (dataToUse) {
      // 비로그인 사용자의 로컬스토리지 데이터 형식 처리
      if (!isLoggedIn) {
        form.reset({
          companyName: dataToUse.companyName || "",
          jobTitle: dataToUse.title || "",
          jobUrl: dataToUse.url || "",
          process: dataToUse.hireProcess || "",
          deadline: dataToUse.deadline || "",
          mainTasks: dataToUse.mainTasks || "",
          qualifications: dataToUse.requirements || "",
          preferences: dataToUse.preferred || "",
          memo: ""
        });
      } else {
        // 로그인 사용자: 기존 서버 데이터 형식 처리
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
    } else {
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
  }, [isOpen, sseData, isLoggedIn, jobPostingData, initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // SSE 모드에서는 기존 초기화 로직 건너뛰기
    if (sseData) return;

    const dataToUse = isLoggedIn ? jobPostingData || initialData : initialData;

    if (isOpen && dataToUse) {
      // 비로그인 사용자의 로컬스토리지 데이터 형식 처리
      if (!isLoggedIn) {
        form.reset({
          companyName: dataToUse.companyName || "",
          jobTitle: dataToUse.title || "",
          jobUrl: dataToUse.url || "",
          process: dataToUse.hireProcess || "",
          deadline: dataToUse.deadline || "",
          mainTasks: dataToUse.mainTasks || "",
          qualifications: dataToUse.requirements || "",
          preferences: dataToUse.preferred || "",
          memo: ""
        });
      } else {
        // 로그인 사용자: 기존 서버 데이터 형식 처리
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
    }
  }, [jobPostingData, initialData, sseData, isLoggedIn, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // SSE 메타데이터로 폼 초기화
  useEffect(() => {
    if (sseData?.metadata && isOpen) {
      startTransition(() => {
        setActiveTab("info");
      });
      form.reset({
        companyName: sseData.metadata.companyName || "",
        jobTitle: sseData.metadata.title || "",
        jobUrl: sseData.metadata.originalUrl || "",
        process: "",
        deadline: sseData.metadata.deadline || "",
        mainTasks: "",
        qualifications: "",
        preferences: "",
        memo: ""
      });
    }
  }, [sseData?.metadata, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // 마크다운 리스트 형식으로 변환 (- 를 • 로 변환하고 줄바꿈 추가)
  const formatBulletList = (text: string) => {
    return text
      .replace(/-/g, "\n• ") // 모든 - 를 줄바꿈 + • 로 변환
      .replace(/^\n• /, "• ") // 맨 앞 줄바꿈 제거
      .trim();
  };

  // SSE 스트리밍 데이터로 폼 필드 업데이트
  useEffect(() => {
    if (sseData && isOpen) {
      if (sseData.hireProcess) {
        form.setValue("process", sseData.hireProcess, { shouldDirty: true });
      }
      if (sseData.mainTasks) {
        form.setValue("mainTasks", formatBulletList(sseData.mainTasks), { shouldDirty: true });
      }
      if (sseData.requirements) {
        form.setValue("qualifications", formatBulletList(sseData.requirements), {
          shouldDirty: true
        });
      }
      if (sseData.preferred) {
        form.setValue("preferences", formatBulletList(sseData.preferred), { shouldDirty: true });
      }
    }
  }, [sseData?.hireProcess, sseData?.mainTasks, sseData?.requirements, sseData?.preferred, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // 내부 SSE 스트리밍 데이터로 폼 필드 업데이트 (등록 화면에서는 기업명/직무명도 반영)
  useEffect(() => {
    if (internalSseData && isOpen) {
      if (!isEdit && internalSseData.metadata?.companyName) {
        form.setValue("companyName", internalSseData.metadata.companyName, { shouldDirty: true });
      }
      if (!isEdit && internalSseData.metadata?.title) {
        form.setValue("jobTitle", internalSseData.metadata.title, { shouldDirty: true });
      }
      if (internalSseData.hireProcess) {
        form.setValue("process", internalSseData.hireProcess, { shouldDirty: true });
      }
      if (internalSseData.mainTasks) {
        form.setValue("mainTasks", formatBulletList(internalSseData.mainTasks), {
          shouldDirty: true
        });
      }
      if (internalSseData.requirements) {
        form.setValue("qualifications", formatBulletList(internalSseData.requirements), {
          shouldDirty: true
        });
      }
      if (internalSseData.preferred) {
        form.setValue("preferences", formatBulletList(internalSseData.preferred), {
          shouldDirty: true
        });
      }
      // 메타데이터는 등록 화면에서 기업명/직무명까지 반영하고 deadline도 업데이트
      if (internalSseData.metadata?.deadline) {
        form.setValue("deadline", internalSseData.metadata.deadline, { shouldDirty: true });
      }
    }
  }, [
    internalSseData.hireProcess,
    internalSseData.mainTasks,
    internalSseData.requirements,
    internalSseData.preferred,
    internalSseData.metadata,
    isOpen,
    isEdit
  ]);

  // 모달 닫힐 때 내부 SSE 리셋
  useEffect(() => {
    if (!isOpen) {
      resetInternalSse();
    }
  }, [isOpen, resetInternalSse]);

  const isSseStreaming = sseData?.isStreaming || internalSseData.isStreaming || false;
  const isFormDisabled = isSseStreaming;
  const FORM_ID = "card-detail-form";

  const onSubmit = (values: CardDetailValues) => {
    const contentJson = {
      process: values.process,
      mainTasks: values.mainTasks,
      qualifications: values.qualifications,
      preferences: values.preferences
    };

    // 비로그인 사용자: 로컬스토리지에 저장
    if (!isLoggedIn) {
      const targetJobId = effectiveJobId;

      if (onSaveToLocal && targetJobId !== undefined) {
        onSaveToLocal({
          id: targetJobId,
          companyName: values.companyName,
          title: values.jobTitle,
          deadline: values.deadline,
          url: values.jobUrl,
          hireProcess: values.process,
          mainTasks: values.mainTasks,
          requirements: values.qualifications,
          preferred: values.preferences
        });
      }
      handleClose();
      return;
    }

    // 로그인 사용자: 서버 API 호출
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

  const handleClose = () => {
    form.reset();
    finalizeNameEdit();
    onClose();
  };

  const handleSaveLocal = () => {
    if (isLoggedIn) {
      return;
    }

    showToast({
      variant: "error",
      leftElement: "로그인한 사용자만 수정할 수 있어요"
    });
  };

  const removeJobFromDashboardCache = (jobId: number) => {
    queryClient.setQueryData<DashboardResponse[] | undefined>(
      getGetDashboardsQueryKey(),
      (previous) => {
        if (!previous) {
          return previous;
        }

        let hasChanges = false;
        const nextDashboards = previous.map((dashboard) => {
          const filteredJobs = dashboard.jobPostings.filter((job) => job.id !== jobId);
          if (filteredJobs.length !== dashboard.jobPostings.length) {
            hasChanges = true;
            return {
              ...dashboard,
              jobPostings: filteredJobs
            };
          }
          return dashboard;
        });

        return hasChanges ? nextDashboards : previous;
      }
    );
  };

  const handleUndoDelete = (jobId: number) => {
    if (jobId === undefined || Number.isNaN(jobId)) {
      return;
    }

    undoSummary(
      { id: jobId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetDashboardsQueryKey() });
          showToast({
            leftElement: "삭제를 취소했어요"
          });
        },
        onError: (error) => {
          console.error("채용 공고 요약 삭제 취소 실패:", error);
        }
      }
    );
  };

  const showDeleteToast = (jobId?: number) =>
    showToast({
      leftElement: "공고를 삭제했어요",
      rightElement:
        jobId !== undefined ? (
          <button
            type="button"
            className="text-sm font-semibold text-[#BFD2FF] hover:text-white focus-visible:outline-none"
            onClick={() => handleUndoDelete(jobId)}
          >
            취소하기
          </button>
        ) : undefined
    });

  const handleDelete = () => {
    const targetJobId = effectiveJobId;
    if (targetJobId === undefined) return;

    if (!isLoggedIn) {
      if (onDeleteLocal) {
        onDeleteLocal(targetJobId);
        showDeleteToast();
      }
      handleClose();
      return;
    }

    deleteSummary(
      { id: targetJobId },
      {
        onSuccess: () => {
          removeJobFromDashboardCache(targetJobId);
          queryClient.invalidateQueries({ queryKey: getGetDashboardsQueryKey() });
          showDeleteToast(targetJobId);
          handleClose();
        },
        onError: (error) => {
          console.error("채용 공고 요약 삭제 실패:", error);
        }
      }
    );
  };

  if (!isOpen) return null;

  const labelClass = "text-[16px] font-bold text-[#727272] mb-[12px] block";

  const isPending = isCreating || isUpdating || isFetching || isSseStreaming || isDeleting || isRenaming;

  const navItemBaseClass =
    "flex flex-col items-center justify-center w-[72px] h-[72px] rounded-[12px] cursor-pointer transition-colors gap-1";
  const activeNavItemClass = "bg-[#F3F3F3] text-[#282828] font-bold";
  const inactiveNavItemClass = "text-[#727272] hover:bg-[#F3F3F3]/50";

  const footerStatus: CardDetailFooterProps["status"] =
    isFetching || isSseStreaming ? "loading" : "default";

  const footerProps: CardDetailFooterProps = {
    isPending,
    isSseStreaming,
    isFetching,
    onClose: handleClose,
    formId: FORM_ID,
    status: footerStatus,
    showDelete: isEdit,
    onDelete: handleDelete,
    isDeletePending: isDeleting,
    onSave: !isLoggedIn && isGuestEditMode ? handleSaveLocal : undefined
  };

  const defaultFooter = <CardDetailFooter {...footerProps} />;

  const resolvedFooter =
    typeof footer === "function" ? footer(footerProps) : (footer ?? defaultFooter);

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
      footer={resolvedFooter}
    >
      <Form {...form}>
        <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          {activeTab === "info" ? (
            <RecruitmentInfoForm
              control={form.control}
              setValue={form.setValue}
              labelClass={labelClass}
              isEdit={isEdit}
              isNameEditMode={isNameEditMode}
              onSummarize={handleSummarize}
              isSummarizing={isSummarizing}
              disabled={isFormDisabled}
              onStartNameEdit={handleStartNameEdit}
              onCancelNameEdit={handleCancelNameEdit}
              onConfirmNameEdit={handleConfirmNameEdit}
              isRenaming={isRenaming}
            />
          ) : (
            <>
              {isEdit && (
                <div className="text-[32px] font-bold text-[#282828] mb-10">
                  {companyName || "기업명"}
                </div>
              )}
              <PersonalMemoForm
                control={form.control}
                labelClass={labelClass}
                disabled={isFormDisabled}
              />
            </>
          )}
        </form>
      </Form>
    </BaseModal>
  );
};
