import { cn } from "@/lib/utils";

interface DimOverlayProps {
  position?: "absolute" | "fixed";
  onClick?: () => void;
  className?: string;
  pointerEvents?: boolean;
}

export function DimOverlay({
  position = "absolute",
  onClick,
  className,
  pointerEvents = true
}: DimOverlayProps) {
  return (
    <div
      className={cn(
        "inset-0 bg-[#2B2B2B66] backdrop-blur-[2px]",
        position === "absolute" ? "absolute" : "fixed",
        !pointerEvents && "pointer-events-none",
        className
      )}
      onClick={onClick}
    />
  );
}
