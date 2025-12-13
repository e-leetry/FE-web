import { create } from "zustand";

type UiStore = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

// This store should only host UI/local state. Server data must stay within React Query.
export const useUiStore = create<UiStore>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen
    }))
}));
