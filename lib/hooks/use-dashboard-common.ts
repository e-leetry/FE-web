"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Route } from "next";
import { useJobSummarizeContext } from "@/lib/context/job-summarize-context";
import type { Job, Column } from "@/components/features/dashboard/dashboard-board";

interface UseDashboardCommonOptions<T extends string = string> {
  /** 현재 페이지 경로 (URL 정리 시 사용) */
  currentPath: Route<T>;
  /** 컬럼 데이터 */
  columns: Column[];
  /** SSE 메타데이터 도착 시 추가 처리 (비회원: 로컬스토리지에 추가) */
  onSseMetadata?: (jobId: number, metadata: NonNullable<ReturnType<typeof useJobSummarizeContext>["streamingData"]["metadata"]>, firstColumnId: string) => void;
  /** SSE 완료 시 처리 */
  onSseComplete: (jobId: number) => void;
}

export function useDashboardCommon({
  currentPath,
  columns,
  onSseMetadata,
  onSseComplete
}: UseDashboardCommonOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { streamingData, startSummarize, reset: resetSse } = useJobSummarizeContext();

  // 공통 상태
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isInputLoading, setIsInputLoading] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [sseJobId, setSseJobId] = useState<number | null>(null);

  // 온보딩에서 넘어온 URL 처리 여부 추적
  const jobUrlProcessedRef = useRef(false);

  // 마운트 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 온보딩에서 넘어온 URL 처리
  useEffect(() => {
    if (!mounted || jobUrlProcessedRef.current) return;

    const jobUrl = searchParams.get("jobUrl");
    if (jobUrl) {
      jobUrlProcessedRef.current = true;

      // URL 쿼리 파라미터 제거
      router.replace(currentPath, { scroll: false });

      // SSE 시작
      startTransition(() => {
        setIsInputLoading(true);
      });
      startSummarize(decodeURIComponent(jobUrl));
    }
  }, [mounted, searchParams, router, startSummarize, currentPath]);

  // SSE 메타데이터 도착 시 처리
  useEffect(() => {
    if (streamingData.metadata && isInputLoading) {
      startTransition(() => {
        setIsInputLoading(false);
        setIsInputOpen(false);

        const jobId = streamingData.metadata!.jobId;
        setSseJobId(jobId);

        // 첫 번째 컬럼 ID (관심공고)
        const firstColumnId = columns[0]?.id || "interest";
        setSelectedColumnId(firstColumnId);

        // 추가 처리 (비회원: 로컬스토리지에 Job 추가)
        onSseMetadata?.(jobId, streamingData.metadata!, firstColumnId);

        // SSE용 임시 job 데이터 설정
        setSelectedJob({
          id: jobId,
          companyName: streamingData.metadata!.companyName,
          title: streamingData.metadata!.title,
          deadline: streamingData.metadata!.deadline || undefined,
          type: "loading"
        });

        // 모달 열기
        setIsModalOpen(true);
      });
    }
  }, [streamingData.metadata, isInputLoading, columns, onSseMetadata]);

  // SSE 완료 시 처리
  useEffect(() => {
    if (streamingData.isComplete && sseJobId) {
      onSseComplete(sseJobId);

      startTransition(() => {
        setSseJobId(null);
      });
    }
  }, [streamingData.isComplete, sseJobId, onSseComplete]);

  // SSE 에러 처리
  useEffect(() => {
    if (streamingData.error) {
      startTransition(() => {
        setIsInputLoading(false);
        setShowErrorToast(true);
      });
      console.error("SSE Error:", streamingData.error);
    }
  }, [streamingData.error]);

  // 공통 핸들러
  const handleSseSubmit = useCallback(
    (url: string) => {
      setIsInputLoading(true);
      startSummarize(url);
    },
    [startSummarize]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setSelectedColumnId(undefined);
    setSseJobId(null);
    resetSse();
  }, [resetSse]);

  return {
    // 상태
    mounted,
    isInputOpen,
    setIsInputOpen,
    isInputLoading,
    showErrorToast,
    setShowErrorToast,
    isModalOpen,
    setIsModalOpen,
    selectedJob,
    setSelectedJob,
    selectedColumnId,
    setSelectedColumnId,
    // SSE 관련
    streamingData,
    // 핸들러
    handleSseSubmit,
    handleCloseModal
  };
}
