"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { initializeAmplitude, trackAmplitudeEvent } from "@/lib/analytics/amplitude";

interface AmplitudeProviderProps {
  children: ReactNode;
}

export function AmplitudeProvider({ children }: AmplitudeProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => searchParams?.toString() ?? "", [searchParams]);

  useEffect(() => {
    initializeAmplitude();
  }, []);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    trackAmplitudeEvent("page_view", {
      pathname,
      search
    });
  }, [pathname, search]);

  return <>{children}</>;
}
