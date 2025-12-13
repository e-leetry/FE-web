"use client";

import { useUiStore } from "@/store/ui/uiStore";

export function SidebarToggle() {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      style={{
        background: "transparent",
        color: "inherit",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        padding: "0.5rem 1rem",
        fontSize: "0.875rem",
        cursor: "pointer"
      }}
    >
      {isSidebarOpen ? "Hide menu" : "Show menu"}
    </button>
  );
}
