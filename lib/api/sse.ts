const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export interface JobMetadata {
  jobId: number;
  companyName: string;
  title: string;
  originalUrl: string;
  deadline: string | null;
}

export interface SseCallbacks {
  onMetadata: (metadata: JobMetadata) => void;
  onHireProcess: (text: string) => void;
  onMainTasks: (text: string) => void;
  onRequirements: (text: string) => void;
  onPreferred: (text: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export async function summarizeJobSse(
  url: string,
  callbacks: SseCallbacks,
  signal?: AbortSignal
): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/jobs/summarize/sse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ url }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("ReadableStream not supported");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // 이벤트 파싱 (빈 줄로 구분)
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        const eventMatch = part.match(/event:\s*(\w+)/);

        // 모든 data: 라인을 찾아서 합침
        const dataLines = part.split("\n").filter(line => line.startsWith("data:"));
        const data = dataLines
          .map(line => line.replace(/^data:\s*/, ""))
          .join("\n")
          .trim();

        if (eventMatch && data) {
          const eventType = eventMatch[1];

          // 디버깅: 서버에서 받은 원본 데이터 출력
          console.log(`[SSE 원본 데이터] ${eventType}:`, JSON.stringify(data));

          switch (eventType) {
            case "metadata":
              callbacks.onMetadata(JSON.parse(data));
              break;
            case "hire_process":
              callbacks.onHireProcess(data);
              break;
            case "main_tasks":
              callbacks.onMainTasks(data);
              break;
            case "requirements":
              callbacks.onRequirements(data);
              break;
            case "preferred":
              callbacks.onPreferred(data);
              break;
            case "complete":
              callbacks.onComplete();
              break;
            case "error":
              try {
                const errorData = JSON.parse(data);
                callbacks.onError(new Error(errorData.message || "Unknown error"));
              } catch {
                callbacks.onError(new Error(data));
              }
              break;
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return;
    }
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  }
}
