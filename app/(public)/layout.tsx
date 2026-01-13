"use client";

import { Header } from "@/components/layout/header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[#F9F9F9]">
      <Header />

      <div className="flex-1 w-full flex flex-col items-center">{children}</div>
    </div>
  );
}
