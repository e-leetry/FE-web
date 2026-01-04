/** @jsxImportSource react */
"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginModal } from "@/components/auth/login-modal";
import { Header } from "@/components/layout/header";

export default function StartPage() {
  const [link, setLink] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 등록 로직 구현
    console.log("Registering link:", link);
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[#F6F7F9]">
      {/* Background Dim & Blur */}
      <div className="absolute inset-0 z-0 bg-[#2B2B2B]/40 backdrop-blur-[4px]" />

      <Header />

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 w-full items-center justify-center px-4 pt-[64px]">
        <div className="flex w-full max-w-[798px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-6 w-full">
            <h1 className="text-center text-[36px] font-bold leading-[1.5] tracking-[-0.02em] text-[#FAFAFA]">
              3초 만에 채용 공고를 정리해요
            </h1>

            <form
              onSubmit={handleSubmit}
              className="flex w-full items-center gap-3 rounded-[32px] bg-white p-[20px] pl-[32px]"
            >
              <Input
                type="text"
                placeholder="등록할 채용 공고의 링크를 입력해주세요"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="h-auto border-none bg-transparent p-0 text-[24px] font-medium leading-[1.5] tracking-[-0.02em] text-[#2B2B2B] placeholder:text-[#9E9E9E] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                type="submit"
                className="h-auto shrink-0 rounded-[32px] bg-[#2B2B2B] px-[16px] py-[12px] text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#FAFAFA] hover:bg-[#2B2B2B]/90"
              >
                등록하기
              </Button>
            </form>

            <Link
              href="/login"
              className="text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#FAFAFA]"
            >
              이미 가입했나요? 로그인하면 바로 쓸 수 있어요
            </Link>
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </main>
  );
}
