"use client";

import { Header } from "@/components/layout/header";
import { usePathname } from "next/navigation";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/onboarding";

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[#F6F7F9]">
      {/* Background Dim & Blur - Only for Onboarding */}
      {isOnboarding && (
        <div className="absolute inset-0 z-0 bg-[#2B2B2B]/40 backdrop-blur-[4px]" />
      )}

      <Header transparent={isOnboarding} isDark={isOnboarding} />

      <div className="flex-1 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
