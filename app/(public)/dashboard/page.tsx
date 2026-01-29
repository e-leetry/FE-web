"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";
import {
  useGetDashboards,
  getGetDashboardsQueryKey
} from "@/lib/api/generated/dashboard/dashboard";
import { useMove } from "@/lib/api/generated/job-posting-summary/job-posting-summary";
import { useQueryClient } from "@tanstack/react-query";
import { useDashboardCommon } from "@/lib/hooks/use-dashboard-common";
import {
  DashboardBoard,
  Column,
  INITIAL_COLUMNS
} from "@/components/features/dashboard/dashboard-board";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  // 비로그인 사용자는 비회원 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/guest/dashboard");
    }
  }, [isLoggedIn, router]);

  const { data: dashboardsData } = useGetDashboards({
    query: {
      enabled: isLoggedIn
    }
  });

  const moveMutation = useMove({
    mutation: {
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: getGetDashboardsQueryKey() });
        const previousData = queryClient.getQueryData(getGetDashboardsQueryKey());
        return { previousData };
      },
      onError: (error, _variables, context) => {
        console.error("Move mutation failed:", error);
        if (context?.previousData) {
          queryClient.setQueryData(getGetDashboardsQueryKey(), context.previousData);
        }
      }
    }
  });

  // 컬럼 데이터 (서버 데이터)
  const columns = useMemo<Column[]>(() => {
    if (dashboardsData && dashboardsData.length > 0) {
      return dashboardsData.map((dashboard) => ({
        id: dashboard.id.toString(),
        title: dashboard.label,
        jobs: (dashboard.jobPostings || []).map((jp) => ({
          id: jp.id,
          companyName: jp.companyName,
          title: jp.title,
          deadline: jp.deadline,
          url: jp.url,
          type: "default" as const
        }))
      }));
    }
    return INITIAL_COLUMNS;
  }, [dashboardsData]);

  // SSE 완료 시 서버 데이터 새로고침
  const handleSseComplete = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getGetDashboardsQueryKey() });
  }, [queryClient]);

  // 공통 훅 사용
  const {
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
    streamingData,
    handleSseSubmit,
    handleCloseModal
  } = useDashboardCommon({
    currentPath: "/dashboard",
    columns,
    onSseComplete: handleSseComplete
  });

  // 드래그 앤 드롭 완료 핸들러
  const handleDragEnd = useCallback(
    (
      activeId: number,
      overColumnId: string,
      currentCardIndex: number,
      _originalColumnId: string | null,
      _originalIndex: number | null,
      currentColumns: Column[]
    ) => {
      const overColumn = currentColumns.find((col) => col.id === overColumnId);
      if (!overColumn) return;

      const prevItemId =
        currentCardIndex > 0 ? overColumn.jobs[currentCardIndex - 1]?.id : undefined;
      const nextItemId =
        currentCardIndex < overColumn.jobs.length - 1
          ? overColumn.jobs[currentCardIndex + 1]?.id
          : undefined;

      queryClient.setQueryData(getGetDashboardsQueryKey(), () => {
        return currentColumns.map((col) => ({
          id: Number(col.id),
          label: col.title,
          jobPostings: col.jobs.map((job) => ({
            id: job.id,
            companyName: job.companyName,
            title: job.title,
            deadline: job.deadline
          }))
        }));
      });

      moveMutation.mutate({
        summaryId: activeId,
        data: {
          dashboardId: Number(overColumnId),
          prevItemId,
          nextItemId
        }
      });
    },
    [queryClient, moveMutation]
  );

  const initialModalData = useMemo(() => {
    if (!selectedJob || selectedJob.id < 0) return null;
    const allJobs = dashboardsData?.flatMap((d) => d.jobPostings || []) || [];
    return allJobs.find((jp) => jp.id === selectedJob.id);
  }, [selectedJob, dashboardsData]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <DashboardBoard
      columns={columns}
      mounted={mounted}
      isInputOpen={isInputOpen}
      setIsInputOpen={setIsInputOpen}
      isInputLoading={isInputLoading}
      showErrorToast={showErrorToast}
      setShowErrorToast={setShowErrorToast}
      onSseSubmit={handleSseSubmit}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      selectedJob={selectedJob}
      setSelectedJob={setSelectedJob}
      selectedColumnId={selectedColumnId}
      setSelectedColumnId={setSelectedColumnId}
      isLoggedIn={true}
      initialModalData={initialModalData}
      sseData={streamingData}
      onDragEnd={handleDragEnd}
      onCloseModal={handleCloseModal}
    />
  );
}
