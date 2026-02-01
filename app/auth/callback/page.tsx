"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { useSync } from "@/lib/api/generated/guest/guest";
import { LOGIN_REDIRECT_STORAGE_KEY } from "@/constants/storage";

const LOCAL_STORAGE_KEY = "reet_dashboard_data";

interface StoredJob {
  id: number;
  companyName: string;
  title?: string;
  deadline?: string;
  url?: string;
  hireProcess?: string;
  mainTasks?: string;
  requirements?: string;
  preferred?: string;
  columnId: number;
}

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processedRef = useRef(false);
  const redirectTargetRef = useRef<Route | null>(null);

  const getValidRedirect = useCallback((value?: string | null): Route => {
    if (value && value.startsWith("/")) {
      return value as Route;
    }
    return "/dashboard";
  }, []);

  const resolveRedirectTarget = useCallback(() => {
    if (redirectTargetRef.current) {
      return redirectTargetRef.current;
    }

    const redirectFromParam = searchParams.get("redirectTo");
    if (redirectFromParam) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(LOGIN_REDIRECT_STORAGE_KEY);
      }
      const normalized = getValidRedirect(redirectFromParam);
      redirectTargetRef.current = normalized;
      return normalized;
    }

    if (typeof window !== "undefined") {
      const storedRedirect = sessionStorage.getItem(LOGIN_REDIRECT_STORAGE_KEY);
      if (storedRedirect) {
        sessionStorage.removeItem(LOGIN_REDIRECT_STORAGE_KEY);
        const normalized = getValidRedirect(storedRedirect);
        redirectTargetRef.current = normalized;
        return normalized;
      }
    }

    const fallback = getValidRedirect(null);
    redirectTargetRef.current = fallback;
    return fallback;
  }, [getValidRedirect, searchParams]);

  const redirectToDestination = useCallback(() => {
    const target = resolveRedirectTarget();
    router.replace(target);
  }, [resolveRedirectTarget, router]);

  const syncMutation = useSync({
    mutation: {
      onSuccess: () => {
        // 동기화 성공 시 로컬스토리지 정리
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        redirectToDestination();
      },
      onError: (error) => {
        console.error("게스트 데이터 동기화 실패:", error);
        // 실패해도 리다이렉트는 진행
        redirectToDestination();
      }
    }
  });

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    // 로컬스토리지에서 게스트 데이터 확인
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData) as StoredJob;

        // 필수 필드 확인
        if (parsed.companyName && parsed.title) {
          syncMutation.mutate({
            data: {
              companyName: parsed.companyName,
              title: parsed.title,
              deadline: parsed.deadline,
              url: parsed.url,
              hireProcess: parsed.hireProcess,
              mainTasks: parsed.mainTasks,
              requirements: parsed.requirements,
              preferred: parsed.preferred
            }
          });
          return;
        }
      } catch (error) {
        console.error("로컬스토리지 파싱 실패:", error);
      }
    }

    // 게스트 데이터가 없거나 파싱 실패 시 바로 리다이렉트
    redirectToDestination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F7F9]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
        <p className="text-sm text-gray-500">로그인 처리 중...</p>
      </div>
    </div>
  );
}
