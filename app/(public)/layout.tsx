import { Header } from "@/components/layout/header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[#F6F7F9]">
      {/* Background Dim & Blur */}
      <div className="absolute inset-0 z-0 bg-[#2B2B2B]/40 backdrop-blur-[4px]" />

      <Header />

      {children}
    </main>
  );
}
