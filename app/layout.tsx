import type { Metadata } from "next";
import { ReactNode } from "react";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { isAuthenticated } from "@/lib/auth/session";
import Providers from "@/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "리트",
    template: "%s · Reetry"
  },
  description: "Next.js 16 web shell for the Reetry platform",
  icons: {
    icon: "/favicon.ico"
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const isLoggedIn = await isAuthenticated();

  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#F9F9F9] text-[#343E4C] antialiased">
        <AuthProvider isLoggedIn={isLoggedIn}>
          <Providers>
            <main className="min-h-screen bg-transparent">{children}</main>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
