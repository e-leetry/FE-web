"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Toast } from "@/components/ui/toast";
import { useToastStore } from "@/store/ui/toast-store";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);
  const [mounted, setMounted] = useState(false);
  const portalTarget = typeof window !== "undefined" ? document.body : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !portalTarget) return null;

  return createPortal(
    <div className="fixed left-1/2 top-10 z-[9999] flex -translate-x-1/2 flex-col gap-3">
      {toasts.map(({ id, ...toastProps }) => (
        <Toast key={id} visible onClose={() => removeToast(id)} {...toastProps} />
      ))}
    </div>,
    portalTarget
  );
}
