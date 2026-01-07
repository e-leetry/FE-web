"use client";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface HeaderProps {
  transparent?: boolean;
  isDark?: boolean;
}

export function Header({ transparent, isDark }: HeaderProps) {
  return (
    <header
      className={cn(
        "absolute top-0 flex h-[64px] w-full items-center justify-between px-[40px] py-[23px] z-50 transition-colors",
        transparent ? "bg-transparent border-transparent" : "bg-white border-b border-[#EEEEEE]"
      )}
    >
      <div className="flex items-center gap-2">
        <Image
          src="/images/logo/logo1.png"
          alt="Reet Logo"
          width={51}
          height={22}
          className={cn("h-[22.39px] w-[51px]", isDark && "brightness-0 invert")}
        />
      </div>
      <Link
        href="/login"
        className={cn(
          "text-[13px] font-semibold tracking-[-0.02em] transition-colors",
          isDark ? "text-white/80 hover:text-white" : "text-[#343E4C]/80 hover:text-[#343E4C]"
        )}
      >
        로그인
      </Link>
    </header>
  );
}
