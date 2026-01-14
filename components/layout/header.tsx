"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";

import { logout as logoutApi } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/useAuth";
import { cn } from "@/lib/utils";

const HEADER_STYLES = {
  base: "flex h-[64px] w-full items-center justify-between px-[40px] py-[23px] z-50 transition-colors",
  transparent: "absolute top-0 bg-transparent border-transparent",
  solid: "bg-white border-b border-[#EEEEEE]",
} as const;

const NAV_LINK_STYLES = {
  base: "text-[13px] font-semibold tracking-[-0.02em] transition-colors",
  dark: "text-white/80 hover:text-white",
  light: "text-[#343E4C]/80 hover:text-[#343E4C]",
} as const;

interface HeaderProps {
  transparent?: boolean;
  isDark?: boolean;
}

interface NavActionProps {
  isDark?: boolean;
  className?: string;
}

function LoginLink({ isDark, className }: NavActionProps) {
  return (
    <Link
      href="/login"
      className={cn(
        NAV_LINK_STYLES.base,
        isDark ? NAV_LINK_STYLES.dark : NAV_LINK_STYLES.light,
        className
      )}
    >
      로그인
    </Link>
  );
}

function LogoutButton({
  isDark,
  className,
  onLogout,
}: NavActionProps & { onLogout: () => void }) {
  return (
    <button
      type="button"
      onClick={onLogout}
      className={cn(
        NAV_LINK_STYLES.base,
        isDark ? NAV_LINK_STYLES.dark : NAV_LINK_STYLES.light,
        className
      )}
    >
      로그아웃
    </button>
  );
}

export function Header({ transparent, isDark }: HeaderProps) {
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    } finally {
      logout();
      window.location.href = "/";
    }
  }, [logout]);

  return (
    <header
      className={cn(
        HEADER_STYLES.base,
        transparent ? HEADER_STYLES.transparent : HEADER_STYLES.solid
      )}
    >
      <div className="flex items-center gap-[9px]">
        <Image
          src="/images/logo/logo-kr.png"
          alt="Reet Logo"
          width={75}
          height={28}
          className={cn("h-[28px] w-[75px]", isDark && "brightness-0 invert")}
        />
      </div>
      {isLoggedIn ? (
        <LogoutButton isDark={isDark} onLogout={handleLogout} />
      ) : (
        <LoginLink isDark={isDark} />
      )}
    </header>
  );
}
