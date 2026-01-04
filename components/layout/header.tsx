"use client";

import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="absolute top-0 flex h-[64px] w-full items-center justify-between border-b border-[#EEEEEE] bg-white px-[40px] py-[23px] z-10">
      <div className="flex items-center gap-2">
        <Image
          src="/images/logo/logo1.png"
          alt="Reet Logo"
          width={51}
          height={22}
          className="h-[22.39px] w-[51px]"
        />
      </div>
      <Link
        href="/login"
        className="text-[13px] font-semibold tracking-[-0.02em] text-[#343E4C]/80"
      >
        로그인
      </Link>
    </header>
  );
}
