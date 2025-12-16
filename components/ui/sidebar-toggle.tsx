"use client";

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui/uiStore";

export function SidebarToggle() {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <Button
      type="button"
      variant="outlined"
      color="secondary"
      size="sm"
      aria-pressed={isSidebarOpen}
      aria-label={isSidebarOpen ? "사이드바 숨기기" : "사이드바 보이기"}
      onClick={toggleSidebar}
    >
      {isSidebarOpen ? "메뉴 숨기기" : "메뉴 보이기"}
    </Button>
  );
}
