"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useJobSummarizeSse, SseStreamingData } from "@/lib/hooks/use-job-summarize-sse";

interface JobSummarizeContextValue {
  streamingData: SseStreamingData;
  startSummarize: (url: string) => void;
  cancelSummarize: () => void;
  reset: () => void;
}

const JobSummarizeContext = createContext<JobSummarizeContextValue | null>(null);

export function JobSummarizeProvider({ children }: { children: ReactNode }) {
  const { streamingData, startSummarize, cancelSummarize, reset } = useJobSummarizeSse();

  return (
    <JobSummarizeContext.Provider
      value={{ streamingData, startSummarize, cancelSummarize, reset }}
    >
      {children}
    </JobSummarizeContext.Provider>
  );
}

export function useJobSummarizeContext() {
  const context = useContext(JobSummarizeContext);
  if (!context) {
    throw new Error("useJobSummarizeContext must be used within JobSummarizeProvider");
  }
  return context;
}
