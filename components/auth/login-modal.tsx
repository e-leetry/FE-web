"use client";

import Image from "next/image";
import { useEffect } from "react";
import { buildAuthorizeUrl } from "@/lib/auth/routes";
import { DimOverlay } from "@/components/ui/dim-overlay";

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    window.location.href = buildAuthorizeUrl("google");
  };

  const handleKakaoLogin = () => {
    window.location.href = buildAuthorizeUrl("kakao");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Dim & Blur */}
      <DimOverlay onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 flex w-full max-w-[400px] flex-col items-center gap-8 rounded-[24px] border border-[#FAFAFA]/10 bg-[#FAFAFA] p-10 px-6 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-[160px]">
            <Image
              src="/images/auth/reet-ci-large.svg"
              alt="Reet CI"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-center text-[16px] font-medium leading-[1.5] tracking-[-0.02em] text-[#727272]">
            공고는 빠르게 정리하고
            <br />
            필요한 건 계속 쌓아두세요
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          {/* Kakao Login Button */}
          <button
            onClick={handleKakaoLogin}
            className="flex h-16 w-full items-center justify-center gap-2 rounded-[16px] bg-[#FDDC3F] p-3 px-6 text-[16px] font-semibold tracking-[-0.02em] text-[#3A2929] hover:bg-[#FDDC3F]/90 border-none shadow-none"
          >
            <Image src="/images/auth/kakao-icon.svg" alt="Kakao" width={20} height={20} />
            카카오 계정으로 로그인
          </button>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="flex h-16 w-full items-center justify-center gap-2 rounded-[16px] border-[#E5E5E5] border-[1.5px] bg-transparent p-3 px-6 text-[16px] font-semibold tracking-[-0.02em] text-[#343E4C] hover:bg-[#E5E5E5]/10 shadow-none"
          >
            <Image src="/images/auth/google-icon.png" alt="Google" width={20} height={20} />
            구글 계정으로 로그인
          </button>
        </div>
      </div>
    </div>
  );
}
