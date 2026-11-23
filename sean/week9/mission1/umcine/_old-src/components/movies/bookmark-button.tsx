import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function BookmarkButton({
  isFavorite,
  onToggle,
  disabled = false,
  className,
  children,
}: BookmarkButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      className={cn(
        "flex cursor-pointer items-center justify-center gap-1.5 rounded-md border disabled:cursor-default disabled:opacity-60",
        isFavorite
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50",
        className,
      )}
    >
      <img
        src="/icons/bookmark.svg"
        alt=""
        className={cn("h-4 w-4", isFavorite && "brightness-0 invert")}
      />
      {children}
    </button>
  );
}