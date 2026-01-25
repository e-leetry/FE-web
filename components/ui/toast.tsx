import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toastVariants = cva(
  "inline-flex items-center gap-8 rounded-full px-5 py-4 h-14 bg-[rgba(40,40,40,0.72)] backdrop-blur-[8px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.05)]",
  {
    variants: {
      variant: {
        success: "",
        error: ""
      }
    },
    defaultVariants: {
      variant: "success"
    }
  }
);

const toastIconVariants = cva(
  "flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0",
  {
    variants: {
      variant: {
        success: "text-[#26B950]",
        error: "text-[#EE6D68]"
      }
    },
    defaultVariants: {
      variant: "success"
    }
  }
);

function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <path
        d="M7 12L10.5 15.5L17 9"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <path
        d="M8 8L16 16M16 8L8 16"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DefaultIcon = ({ variant }: { variant: "success" | "error" }) => {
  const Icon = variant === "success" ? SuccessIcon : ErrorIcon;
  return <Icon />;
};

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  /** 왼쪽 영역 (아이콘 + 텍스트) - 기본 아이콘 사용 시 문자열만 전달 */
  leftElement?: React.ReactNode;
  /** 오른쪽 영역 (부가 텍스트, 액션 버튼 등) */
  rightElement?: React.ReactNode;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "success", leftElement, rightElement, ...props }, ref) => {
    const renderLeftElement = () => {
      // leftElement가 문자열인 경우 기본 아이콘과 함께 렌더링
      if (typeof leftElement === "string") {
        return (
          <div className="flex items-center gap-2">
            <span className={toastIconVariants({ variant })}>
              <DefaultIcon variant={variant ?? "success"} />
            </span>
            <span className="text-white text-base font-bold leading-tight tracking-tight">
              {leftElement}
            </span>
          </div>
        );
      }
      // ReactNode인 경우 그대로 렌더링
      return leftElement;
    };

    return (
      <div ref={ref} className={cn(toastVariants({ variant }), className)} {...props}>
        {leftElement && renderLeftElement()}
        {rightElement && (
          <div className="flex items-center gap-1 text-[#EEEEEE] text-sm font-medium leading-tight tracking-tight">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);
Toast.displayName = "Toast";

export { Toast, toastVariants, toastIconVariants, SuccessIcon, ErrorIcon };
