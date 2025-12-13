import { QueryClient, QueryClientConfig } from "@tanstack/react-query";

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false
    }
  }
};

let queryClient: QueryClient | null = null;

export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient(queryClientConfig);
  }

  return queryClient;
}

export const queryKeys = {
  health: ["health"],
  me: ["me"]
} as const;
