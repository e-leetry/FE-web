"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth/authStore";

type AuthProviderProps = {
  isLoggedIn: boolean;
  children: React.ReactNode;
};

/**
 * 서버에서 전달받은 로그인 상태를 클라이언트 store에 주입합니다.
 * 최상위 레이아웃에서 사용하세요.
 */
export function AuthProvider({ isLoggedIn, children }: AuthProviderProps) {
  const initialized = useRef(false);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  useEffect(() => {
    if (!initialized.current) {
      setIsLoggedIn(isLoggedIn);
      initialized.current = true;
    }
  }, [isLoggedIn, setIsLoggedIn]);

  return <>{children}</>;
}
