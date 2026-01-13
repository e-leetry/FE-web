"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginModal } from "@/components/auth/login-modal";
import { DimOverlay } from "@/components/ui/dim-overlay";

export default function StartPage() {
  const [link, setLink] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // URL 형식 검증
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    if (!urlPattern.test(link)) {
      setIsInvalid(true);
      setLink("");
      return;
    }

    setIsInvalid(false);
    // TODO: 등록 로직 구현
    console.log("Registering link:", link);
  };

  return (
    <>
      {/* Main Content */}
      <div className="relative z-[110] flex flex-1 w-full items-center justify-center px-4">
        <div className="flex w-full max-w-[798px] flex-col items-center gap-[48px]">
          <div className="flex flex-col items-center gap-[24px] w-full">
            <h1 className="text-center text-[36px] font-bold leading-[1.5] tracking-[-0.02em] text-[#FAFAFA]">
              3초 만에 채용 공고를 정리해요
            </h1>

            <form
              onSubmit={handleSubmit}
              className="flex w-full items-center gap-[12px] rounded-[320px] bg-[#FAFAFA] p-[16px]"
            >
              <Input
                type="text"
                placeholder={isInvalid ? "올바른 형식의 링크를 입력해주세요" : "등록할 채용 공고의 링크를 입력해주세요"}
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                  setIsInvalid(false);
                }}
                className={`h-auto border-none bg-transparent px-[16px] py-0 text-[20px] font-medium leading-[1.5] tracking-[-0.02em] text-[#2B2B2B] focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  isInvalid ? "placeholder:text-[#F05552]" : "placeholder:text-[#9E9E9E]"
                }`}
              />
              <Button
                type="submit"
                className="h-auto shrink-0 rounded-[320px] bg-[#2B2B2B] px-[16px] py-[12px] text-[18px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#FAFAFA] hover:bg-[#2B2B2B]/90"
              >
                등록하기
              </Button>
            </form>

            <Link
              href="/login"
              className="text-[20px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#FAFAFA]"
            >
              이미 가입했나요? <span className="underline">로그인</span>하면 바로 쓸 수 있어요
            </Link>
          </div>
        </div>
      </div>
      <DimOverlay position="fixed" pointerEvents={false} className="z-[100]" />
    </>
  );
}
