"use client";

import { useState, useCallback, useRef } from "react";
import { summarizeJobSse, JobMetadata } from "@/lib/api/sse";

export interface SseStreamingData {
  metadata: JobMetadata | null;
  hireProcess: string;
  mainTasks: string;
  requirements: string;
  preferred: string;
  isStreaming: boolean;
  isComplete: boolean;
  error: Error | null;
}

export function useJobSummarizeSse() {
  const [streamingData, setStreamingData] = useState<SseStreamingData>({
    metadata: null,
    hireProcess: "",
    mainTasks: "",
    requirements: "",
    preferred: "",
    isStreaming: false,
    isComplete: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const startSummarize = useCallback((url: string) => {
    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // 상태 초기화
    setStreamingData({
      metadata: null,
      hireProcess: "",
      mainTasks: "",
      requirements: "",
      preferred: "",
      isStreaming: true,
      isComplete: false,
      error: null,
    });

    summarizeJobSse(
      url,
      {
        onMetadata: (metadata) => {
          setStreamingData((prev) => ({
            ...prev,
            metadata,
          }));
        },
        onHireProcess: (text) => {
          setStreamingData((prev) => ({
            ...prev,
            hireProcess: prev.hireProcess + text,
          }));
        },
        onMainTasks: (text) => {
          setStreamingData((prev) => ({
            ...prev,
            mainTasks: prev.mainTasks + text,
          }));
        },
        onRequirements: (text) => {
          setStreamingData((prev) => ({
            ...prev,
            requirements: prev.requirements + text,
          }));
        },
        onPreferred: (text) => {
          setStreamingData((prev) => ({
            ...prev,
            preferred: prev.preferred + text,
          }));
        },
        onComplete: () => {
          setStreamingData((prev) => ({
            ...prev,
            isStreaming: false,
            isComplete: true,
          }));
        },
        onError: (error) => {
          setStreamingData((prev) => ({
            ...prev,
            isStreaming: false,
            error,
          }));
        },
      },
      controller.signal
    );
  }, []);

  const cancelSummarize = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStreamingData((prev) => ({
      ...prev,
      isStreaming: false,
    }));
  }, []);

  const reset = useCallback(() => {
    cancelSummarize();
    setStreamingData({
      metadata: null,
      hireProcess: "",
      mainTasks: "",
      requirements: "",
      preferred: "",
      isStreaming: false,
      isComplete: false,
      error: null,
    });
  }, [cancelSummarize]);

  return {
    streamingData,
    startSummarize,
    cancelSummarize,
    reset,
  };
}
