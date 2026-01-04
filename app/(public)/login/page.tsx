"use client";

import { useState } from "react";
import { LoginModal } from "@/components/auth/login-modal";

export default function LoginPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);

  return <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(true)} />;
}
