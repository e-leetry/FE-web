"use client";

import { create } from "zustand";

import type { ToastProps } from "@/components/ui/toast";

type ToastPayload = Omit<ToastProps, "visible" | "onClose" | "ref"> & {
  id: string;
};

interface ToastState {
  toasts: ToastPayload[];
  addToast: (toast: ToastPayload) => void;
  removeToast: (id: string) => void;
}

const createToastId = () => crypto.randomUUID?.() ?? `toast-${Date.now()}`;

export type ShowToastOptions = Omit<ToastPayload, "id">;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set(() => ({
      toasts: [toast]
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }))
}));

export const showToast = (options: ShowToastOptions) => {
  if (typeof window === "undefined") return;

  const id = createToastId();
  const { addToast } = useToastStore.getState();

  addToast({
    id,
    ...options
  });
};
