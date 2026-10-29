interface RequestStateProps {
  message: string;
  loading?: boolean;
  onRetry?: () => void;
}

export function RequestState({ message, loading = false, onRetry }: RequestStateProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center"
      role={onRetry ? "alert" : "status"} aria-live="polite" aria-busy={loading}>
      {loading && <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />}
      <p className="text-sm leading-6 text-slate-600">{message}</p>
      {onRetry && <button className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-200"
        type="button" onClick={onRetry}>다시 시도</button>}
    </div>
  );
}
