import type { Metadata } from "next";
import { ReactNode } from "react";

import Providers from "@/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Reetry Frontend",
    template: "%s · Reetry"
  },
  description: "Next.js 16 web shell for the Reetry platform",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
