"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useAuth } from "@/lib/auth/useAuth";
import {
  useLocalDashboard,
  LocalJob,
  INITIAL_LOCAL_COLUMNS
} from "@/lib/hooks/use-local-dashboard";
import { useDashboardCommon } from "@/lib/hooks/use-dashboard-common";
import { useJobSummarizeContext } from "@/lib/context/job-summarize-context";
import { DashboardBoard, Column } from "@/components/features/dashboard/dashboard-board";
import { showToast } from "@/store/ui/toast-store";
import { buildLoginRedirect } from "@/lib/auth/routes";

export default function GuestDashboardPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { streamingData } = useJobSummarizeContext();

  // 로그인 사용자는 회원 페이지로 리다이렉트
  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, router]);

  // 로컬스토리지 훅
  const {
    columns: localStorageColumns,
    isLoaded: isLocalLoaded,
    addJob,
    addLoadingJob,
    updateJob: updateLocalJob,
    moveJob: moveLocalJob,
    reorderJobs: reorderLocalJobs,
    findJob: findLocalJob,
    removeJob: removeLocalJob
  } = useLocalDashboard();

  // 잡 카드가 하나도 없으면 온보딩으로 이동
  // useEffect(() => {
  //   if (isLocalLoaded) {
  //     const totalJobs = localStorageColumns.reduce((acc, col) => acc + col.jobs.length, 0);
  //     if (totalJobs === 0) {
  //       router.replace("/onboarding");
  //     }
  //   }
  // }, [isLocalLoaded, localStorageColumns, router]);

  // 컬럼 데이터 (로컬스토리지)
  const columns = useMemo<Column[]>(() => {
    if (isLocalLoaded) {
      return localStorageColumns.map((col) => ({
        id: col.id,
        title: col.title,
        jobs: col.jobs.map((job) => ({
          id: job.id,
          companyName: job.companyName,
          title: job.title,
          deadline: job.deadline,
          url: job.url,
          type: job.type || ("default" as const)
        }))
      }));
    }
    return INITIAL_LOCAL_COLUMNS.map((col) => ({ ...col, jobs: [...col.jobs] }));
  }, [isLocalLoaded, localStorageColumns]);

  // SSE 메타데이터 도착 시 로컬스토리지에 추가
  const handleSseMetadata = useCallback(
    (
      jobId: number,
      metadata: {
        companyName: string;
        title: string;
        deadline?: string | null;
        originalUrl: string;
      },
      firstColumnId: number
    ) => {
      addLoadingJob(
        {
          id: jobId,
          companyName: metadata.companyName,
          title: metadata.title,
          deadline: metadata.deadline || undefined,
          url: metadata.originalUrl
        },
        firstColumnId
      );
    },
    [addLoadingJob]
  );

  // SSE 완료 시 로컬스토리지 업데이트
  const handleSseComplete = useCallback(
    (jobId: number) => {
      updateLocalJob(jobId, {
        hireProcess: streamingData.hireProcess,
        mainTasks: streamingData.mainTasks,
        requirements: streamingData.requirements,
        preferred: streamingData.preferred
      });
    },
    [updateLocalJob, streamingData]
  );

  // SSE 실패 시 기본 카드 생성
  const handleSseError = useCallback(
    (failedUrl: string | null) => {
      const firstColumnId = localStorageColumns[0]?.id || 1;
      addJob(
        {
          id: Date.now(),
          companyName: "새회사",
          title: "새공고",
          url: failedUrl || undefined
        },
        firstColumnId
      );
    },
    [addJob, localStorageColumns]
  );

  // 공통 훅 사용
  const {
    mounted,
    isInputOpen,
    setIsInputOpen,
    isInputLoading,
    isModalOpen,
    setIsModalOpen,
    selectedJob,
    setSelectedJob,
    selectedColumnId,
    setSelectedColumnId,
    streamingData: sseData,
    handleSseSubmit,
    handleCloseModal
  } = useDashboardCommon({
    currentPath: "/guest/dashboard" as Route<"/guest/dashboard">,
    columns,
    onSseMetadata: handleSseMetadata,
    onSseComplete: handleSseComplete,
    onSseError: handleSseError
  });

  // 드래그 앤 드롭 완료 핸들러
  const handleDragEnd = useCallback(
    (
      activeId: number,
      overColumnId: number,
      currentCardIndex: number,
      originalColumnId: number | null,
      originalIndex: number | null
    ) => {
      if (originalColumnId === overColumnId) {
        reorderLocalJobs(overColumnId, originalIndex!, currentCardIndex);
      } else {
        moveLocalJob(activeId, overColumnId, currentCardIndex);
      }
    },
    [reorderLocalJobs, moveLocalJob]
  );

  const handleSaveToLocal = useCallback(
    (jobData: LocalJob) => {
      updateLocalJob(jobData.id, jobData);
    },
    [updateLocalJob]
  );

  const handleDeleteLocal = useCallback(
    (jobId: number) => {
      removeLocalJob(jobId);
    },
    [removeLocalJob]
  );

  const initialModalData = useMemo(() => {
    if (!selectedJob || selectedJob.id < 0) return null;
    return findLocalJob(selectedJob.id);
  }, [selectedJob, findLocalJob]);

  const loginRedirectUrl = useMemo(() => buildLoginRedirect("/guest/dashboard"), []);

  const onButtonClick = () => {
    showToast({
      variant: "error",
      leftElement: "로그인한 사용자만 공고를 추가할 수 있어요"
    });
    router.push(loginRedirectUrl);
    return false;
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <DashboardBoard
      columns={columns}
      mounted={mounted}
      isInputOpen={isInputOpen}
      setIsInputOpen={setIsInputOpen}
      isInputLoading={isInputLoading}
      onSseSubmit={handleSseSubmit}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      selectedJob={selectedJob}
      setSelectedJob={setSelectedJob}
      selectedColumnId={selectedColumnId}
      setSelectedColumnId={setSelectedColumnId}
      isLoggedIn={false}
      initialModalData={initialModalData}
      sseData={sseData}
      onDragEnd={handleDragEnd}
      onCloseModal={handleCloseModal}
      onSaveToLocal={handleSaveToLocal}
      onDeleteLocal={handleDeleteLocal}
      onSaveButtonClick={onButtonClick}
      loginRedirectPath="/guest/dashboard"
    />
  );
}
