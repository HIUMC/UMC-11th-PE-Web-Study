import { getErrorMessage } from "../../api/request-error";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({
  label = "영화 정보를 불러오는 중이에요.",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 py-24 text-sm text-ink-muted"
    >
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand"
      />
      {label}
    </div>
  );
}

interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 py-24 text-center"
    >
      <p className="text-sm text-ink-muted">{getErrorMessage(error)}</p>
      <button
        type="button"
        onClick={onRetry}
        className="h-10 rounded-md bg-ink px-5 text-sm font-bold text-surface"
      >
        다시 시도
      </button>
    </div>
  );
}
