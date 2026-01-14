import { api } from "../api-client";

// 로그아웃
export const logout = async (): Promise<void> => {
  await api.post<void>("/api/v1/auth/logout");
};
