"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoginModal } from "@/components/auth/login-modal";

export default function LoginPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  return (
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(true)}
      redirectTo={redirectTo}
    />
  );
}
