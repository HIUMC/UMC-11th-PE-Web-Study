import { getRequestErrorMessage } from "../../api/tmdb";

interface QueryFeedbackProps {
  isFetching: boolean;
  error: unknown;
  onRetry: () => void;
}

export function QueryFeedback({ isFetching, error, onRetry }: QueryFeedbackProps) {
  if (isFetching) {
    return <p className="mb-5 text-sm text-slate-500" role="status">최신 정보를 확인하고 있어요.</p>;
  }
  if (error) {
    return (
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
        <p>최신 정보를 불러오지 못해 이전 결과를 보여 드려요. {getRequestErrorMessage(error)}</p>
        <button className="rounded-lg border border-amber-300 bg-white px-3 py-2 font-bold focus-visible:ring-3 focus-visible:ring-amber-200" type="button" onClick={onRetry}>다시 시도</button>
      </div>
    );
  }
  return null;
}
