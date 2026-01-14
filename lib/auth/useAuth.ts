"use client";

import { useAuthStore } from "@/store/auth/authStore";

/**
 * 클라이언트에서 로그인 상태를 확인하고 관리하는 훅입니다.
 */
export function useAuth() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return {
    isLoggedIn,
    login,
    logout,
  };
}
