"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

export type CardDetailFooterStatus = "default" | "loading" | "deleteConfirm";

export interface CardDetailFooterProps {
  isPending: boolean;
  isSseStreaming: boolean;
  isFetching: boolean;
  onClose: () => void;
  formId: string;
  status?: CardDetailFooterStatus;
  statusText?: string;
  showDelete?: boolean;
  onDelete?: () => void;
  isDeletePending?: boolean;
  deleteLabel?: string;
}

const STATUS_CONTENT: Record<Exclude<CardDetailFooterStatus, "default">, { icon: string; text: string; alt: string }> = {
  loading: {
    icon: "/images/icon/ico_ai.svg",
    text: "공고 불러오는 중",
    alt: "공고 불러오는 중"
  },
  deleteConfirm: {
    icon: "/images/icon/ico_delete.svg",
    text: "공고 삭제하기",
    alt: "공고 삭제하기"
  }
};

export function CardDetailFooter({
  isPending,
  isSseStreaming,
  isFetching,
  onClose,
  formId,
  status,
  statusText,
  showDelete = false,
  onDelete,
  isDeletePending = false,
  deleteLabel
}: CardDetailFooterProps) {
  const resolvedStatus: CardDetailFooterStatus =
    status ?? (isFetching || isSseStreaming ? "loading" : "default");

  const statusContent = resolvedStatus === "default" ? null : STATUS_CONTENT[resolvedStatus];
  const showDeleteButton = Boolean(showDelete && onDelete);
  const displayStatusText = statusText ?? statusContent?.text;
  const hasLeftContent = Boolean(statusContent || showDeleteButton);
  const footerLayoutClass = hasLeftContent
    ? "flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    : "flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end";

  const isCloseDisabled = isPending && !isFetching;
  const isSubmitDisabled = isPending;

  return (
    <div className={footerLayoutClass}>
      {hasLeftContent ? (
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          {statusContent ? (
            <div className="flex items-center gap-2 text-[18px] font-medium text-[#5C5C5C]">
              <Image src={statusContent.icon} alt={statusContent.alt} width={32} height={32} />
              <span>{displayStatusText}</span>
            </div>
          ) : null}

          {showDeleteButton ? (
            <Button
              type="button"
              variant="text"
              color="dark"
              size="xl"
              disabled={isDeletePending || isPending}
              onClick={onDelete}
              className="h-auto px-0 py-0 text-[18px] font-medium text-[#5C5C5C] hover:bg-transparent hover:text-[#282828] sm:flex-none"
            >
              <Image src="/images/icon/ico_delete.svg" alt="삭제하기" width={24} height={24} />
              <span>{isDeletePending ? "삭제 중..." : deleteLabel ?? "삭제하기"}</span>
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="flex w-full justify-end gap-2 sm:w-auto">
        <Button
          type="button"
          color="neutral"
          size="xl"
          disabled={isCloseDisabled}
          onClick={onClose}
          className="flex-1 sm:flex-none"
        >
          닫기
        </Button>
        <Button
          type="submit"
          color="primary"
          size="xl"
          disabled={isSubmitDisabled}
          form={formId}
          className="flex-1 sm:flex-none"
        >
          {isPending
            ? isSseStreaming
              ? "요약 중..."
              : isFetching
                ? "로딩 중..."
                : "저장 중..."
            : "저장하기"}
        </Button>
      </div>
    </div>
  );
}
